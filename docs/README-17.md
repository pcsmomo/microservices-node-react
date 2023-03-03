# Details

<details open> 
  <summary>Click to Contract/Expend</summary>

# How to run

```sh
minikube tunnel

# ./ticketing/client
docker build -t pcsmomo/client .
docker push pcsmomo/client # skaffold pull the image from here

# ./ticketing
skaffold dev

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
```

add `127.0.0.1 ticketing.dev` to /etc/hosts

```sh
# temporarily port forwarding NATS services
k get pods

# NATS client
k port-forward nats-depl-588b8b6b8-2s9nt 4222:4222

# NATS mornitoring service (not necessary. For debugging)
k port-forward nats-depl-588b8b6b8-2s9nt 8222:8222
```

```sh
# NATS publisher and listener in separated tabs
npm run publish
npm run listen # x2 or x3, for more listener(=consumer)
```

## Section 17 - Cross-Service Data Replication in Action

### 356. Scaffolding the Orders Service

1. Duplicate the 'tickets' service
2. Install dependencies
3. Build an image out of the order service
4. Create a Kubernetes deployment file
5. Set up file sync options in the skaffold.yaml file
6. Set up routing rules in the ingress service

```sh
# ticketing/orders
npm install
docker build -t pcsmomo/orders .
docker push pcsmomo/orders
```

### 357. A Touch More Setup

```sh
# ticketing
skaffold dev  # had to run a few times
```

### 360. Subtle Service Coupling

We will check ticketId if it is a mongodbID which makes subtle coupling\
If you don't like this coupling, this `.custom()` line can be just deleted

```ts
body('ticketId')
  .not()
  .isEmpty()
  .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
  .withMessage('TicketId must be provided');
```

### 361. Associating Orders and Tickets

We need to somehow associate Tickets and Orders together\
"Ticket Document", "Order Document"\
Two primary ways to do this with MongoDB/mongoose

- Option #1: Embedding
  ```json
  { ..., "ticket" {} }
  ```
  - Querying is a bit challenging
  - There are tickets not ordered, but order service woulnd't know about them
- **Option #2: Mongoose Ref/Population Feature**
  - [mongoose Populate Documentation](https://mongoosejs.com/docs/populate.html)

### 364. Creating an Order Status Enum

```sh
# udemy/microservices-node-react/dwktickets-npm/commmon
npm run pub
# + @dwktickets/common@1.0.7
```

### 382. Can We Cancel?

```ts
// if it is production, we should not use "!"". It is just for test
expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
```

## Section 18 - Understanding Event Flow

### 385. Creating the Events

```sh
# udemy/microservices-node-react/dwktickets-npm/commmon
npm run pub
# + @dwktickets/common@1.0.9
# made a mistake for 1.0.8

# auth, tickets, orders
npm update @dwktickets/common
```

## Section 19 - Listening for Events and Handling Concurrency Issues

### 400. A Quick Manual Test

Postman manual test

- Signup: https://ticketing.dev/api/users/signup
- Check user: https://ticketing.dev/api/users/currentuser
- Create a new ticket: POST https://ticketing.dev/api/tickets
- Update the ticket: PUT https://ticketing.dev/api/tickets

```sh
# skaffold dev
# [tickets] Event published to subject ticket:created
# [orders] Message received: ticket:created / orders-service
# [orders] Message received: ticket:updated / orders-service
# [tickets] Event published to subject ticket:updated
```

### 401. Clear Concurrency Issues

(Optional) Set up "concurrency-test" script to simulate

- creating a ticket with price 5
- modify the price to 10
- modify the price to 15
- run them 200 times

#### Action!

- Cleanup database
  - tickets-mongo
    ```sh
    # see tickets in
    k get pods
    k exec -it <tickets-mongo-pod> sh
    mongosh
    test> show dbs
    # admin     40.00 KiB
    # config   108.00 KiB
    # local     40.00 KiB
    # tickets   72.00 KiB
    test> use tickets
    tickets> show collections
    # tickets
    tickets> db.tickets.find({})
    # ...
    tickets> db.tickets.remove({})
    ```
  - orders-mongo
    ```sh
    # see tickets in
    k get pods
    k exec -it <orders-mongo-pod> sh
    mongosh
    test> show dbs
    # admin    40.00 KiB
    # config  108.00 KiB
    # local    40.00 KiB
    # orders   80.00 KiB
    test> use orders
    orders> show collections
    # orders
    # tickets
    orders> db.tickets.find({})
    # ...
    orders> db.tickets.remove({})
    ```
- Make 600 (3 \* 200) requests
  ```sh
  # ticketing/playground/concurrency-test
  npm start
  ```
- Check the database
  ```sh
  # probably the order version of mongodb uses .length()
  orders> db.tickets.find({ price: 10 }).count()
  # 0
  tickets> db.tickets.find({ price: 10 }).count()
  # It should be 0, but when there's concurrent issue.
  # there'd be some tickets with price 10, (wasn't updated to 15)
  ```

### 404. Mongoose Update-If-Current

[npm mongoose-update-if-current](https://www.npmjs.com/package/mongoose-update-if-current)

```sh
# ticketing/tickets
npm install mongoose-update-if-current
```

mongoose is managing version with `__v` flag, but we will use `version`

### 405. Implementing OCC with Mongoose

Optimistic Concurrency Issue : OCC

```ts
// ticketing/tickets/src/models/ticket.ts
ticketSchema.set('versionKey', 'version');
```

### 409. Who Updates Versions?

Who should we increment or include the 'version' number of a record with an event?\
-> Increment/include the 'version' number whenever the `primary service responsible for a record`\
 emits an event to describe a `create/update/detroy` to a record

### 410. Including Versions in Events

```sh
# udemy/microservices-node-react/dwktickets-npm/commmon
npm run pub
# + @dwktickets/common@1.0.10

# tickets, orders, (auth)
npm update @dwktickets/common
```

</details>
