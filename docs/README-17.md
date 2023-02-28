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

</details>
