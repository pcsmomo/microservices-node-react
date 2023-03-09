# Details

<details open> 
  <summary>Click to Contract/Expend</summary>

# How to run

```sh
minikube tunnel

# ./ticketing/client
docker build -t pcsmomo/client .
docker push pcsmomo/client # skaffold pull the image from here
# build and push all services
# client, auth, tickets, orders, expiration, payment

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=<Secret key>
kubectl get secrets
# NAME            TYPE     DATA   AGE
# jwt-secret      Opaque   1      15d
# stripe-secret   Opaque   1      53s

# ./ticketing
skaffold dev
# if some services run before NATS service and couldn't connect to NATS, delete the pod to restart it.
# NatsError: Could not connect to server: Error: getaddrinfo ENOTFOUND nats-srv
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

## Section 20 - Worker Services

### 441. Expiration Options

- Option #1. setTimeout
  - Timer stored in memory, if service restarts, all timers are lost
- Option #2. Time to emit? No? Then don't ack
  - Rely on NATS redelivery mechanism
  - It will get confusiong quickly
- Options #3. Message broker
  - Broker waits 15 mins to publish message
  - NATS doesn't have this feature, but some other broker might have this feature.
  - If we can use this feature, we don't even need expiration service.
- **Options #4. Use `bull.js`, Job manager**
  - `bull.js` allows us to set up long live timers
  - `bull.js` store the message to redis instance

### 442. Initial Setup

[npm bull](https://www.npmjs.com/package/bull)

```sh
# ticketing
mkdir expiration
cd expiration

# and copy some files from `tickets` service
# and remove dependencies that are not needed

npm install
npm install bull
```

### 444. A Touch of Kubernetes Setup

```sh
# ticketing/expiration
docker build -t pcsmomo/expiration .
docker push pcsmomo/expiration

# after creating expiration config files
# restart scaffold
scaffold dev
```

### 451. Delaying Job Processing

iTerm2 shortcut : Command + K - Clear the console

### 452. Defining the Expiration Complete Event

```sh
# udemy/microservices-node-react/dwktickets-npm/commmon
npm run pub
# + @dwktickets/common@1.0.12

# expiration, order, (tickets, auth)
# update package.json first, skaffold will install the version defined in package.json
# "@dwktickets/common": "^1.0.12",
npm update @dwktickets/common
```

## Section 21 - Handling Payments

### 462. Initial Setup

```sh
# ticketing
mkdir payments
cd payments

# and copy some files from `tickets` service
# and modify index.ts, app.ts and package.json files

npm install

# ticketing/payments
docker build -t pcsmomo/payments .
docker push pcsmomo/payments

# after creating payments config files
# restart scaffold
scaffold dev
```

### 467. Testing Order Creation

If we assume `order` would be not null, we can convince typescript like this

```ts
// Way 1
const order = (await Order.findById(data.id)) as OrderDoc;
expect(order.price).toEqual(data.ticket.price);

// Way 2. what the author uses
const order = await Order.findById(data.id);
expect(order!.price).toEqual(data.ticket.price);
```

### 472. Implementing the Create Charge Handler

Payment Service Flow

- Find order the user id trying to pay for
- Make sure the order belongs to this user
- Make sure the payment abount matches the amount due for the order
- Verify payment with Stripe API
  - Stripe API
- Create `charge` record to record successful payment

### 476. Stripe Setup

```sh
# ticketing/payments
npm install stripe
```

Login https://stripe.com/ and check `Publishable key` and `Secret key`

### 477. Creating a Stripe Secret

```sh
kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=<Secret key>
kubectl get secrets
# NAME            TYPE     DATA   AGE
# jwt-secret      Opaque   1      15d
# stripe-secret   Opaque   1      53s
```

and add `STRIPE_KEY` to `ticketing/infra/k8s/payments-depl.yaml`

### 478. Creating a Charge with Stripe

[Stripe API Documentation - create a charge](https://stripe.com/docs/api/charges/create)

### 479. Manual Testing of Payments

Stripe mock token : "tok_visa"

Postman endpoint: POST https://ticketing.dev/api/payments

If you provide a wrong token, you will get error messages like this

```sh
[payments] StripeInvalidRequestError: No such token: 'tok_visa111'
[payments]     at Function.generate (/app/node_modules/stripe/lib/Error.js:10:20)
[payments]     at res.toJSON.then.Error_1.StripeAPIError.message (/app/node_modules/stripe/lib/RequestSender.js:105:51)
[payments]     at processTicksAndRejections (node:internal/process/task_queues:95:5) {
[payments]   type: 'StripeInvalidRequestError',
[payments]   raw: {
[payments]     code: 'resource_missing',
[payments]     doc_url: 'https://stripe.com/docs/error-codes/resource-missing',
[payments]     message: "No such token: 'tok_visa111'",
[payments]     param: 'source',
[payments]     request_log_url: 'https://dashboard.stripe.com/test/logs/req_4YTbrzQTpySHjX?t=1678169173',
[payments]     type: 'invalid_request_error',
[payments]     headers: {
[payments]       server: 'nginx',
[payments]       date: 'Tue, 07 Mar 2023 06:06:13 GMT',
[payments]       'content-type': 'application/json',
[payments]       'content-length': '327',
[payments]       connection: 'keep-alive',
[payments]       'access-control-allow-credentials': 'true',
[payments]       'access-control-allow-methods': 'GET, POST, HEAD, OPTIONS, DELETE',
[payments]       'access-control-allow-origin': '*',
[payments]       'access-control-expose-headers': 'Request-Id, Stripe-Manage-Version, X-Stripe-External-Auth-Required, X-Stripe-Privileged-Session-Required',
[payments]       'access-control-max-age': '300',
[payments]       'cache-control': 'no-cache, no-store',
[payments]       'idempotency-key': '2c8d3efc-27f3-484a-b420-a4986a44fcd9',
[payments]       'original-request': 'req_4YTbrzQTpySHjX',
[payments]       'request-id': 'req_4YTbrzQTpySHjX',
[payments]       'stripe-version': '2022-11-15',
[payments]       'strict-transport-security': 'max-age=63072000; includeSubDomains; preload'
[payments]     },
[payments]     statusCode: 400,
[payments]     requestId: 'req_4YTbrzQTpySHjX'
[payments]   },
[payments]   rawType: 'invalid_request_error',
[payments]   code: 'resource_missing',
[payments]   doc_url: 'https://stripe.com/docs/error-codes/resource-missing',
[payments]   param: 'source',
[payments]   detail: undefined,
[payments]   headers: {
[payments]     server: 'nginx',
[payments]     date: 'Tue, 07 Mar 2023 06:06:13 GMT',
[payments]     'content-type': 'application/json',
[payments]     'content-length': '327',
[payments]     connection: 'keep-alive',
[payments]     'access-control-allow-credentials': 'true',
[payments]     'access-control-allow-methods': 'GET, POST, HEAD, OPTIONS, DELETE',
[payments]     'access-control-allow-origin': '*',
[payments]     'access-control-expose-headers': 'Request-Id, Stripe-Manage-Version, X-Stripe-External-Auth-Required, X-Stripe-Privileged-Session-Required',
[payments]     'access-control-max-age': '300',
[payments]     'cache-control': 'no-cache, no-store',
[payments]     'idempotency-key': '2c8d3efc-27f3-484a-b420-a4986a44fcd9',
[payments]     'original-request': 'req_4YTbrzQTpySHjX',
[payments]     'request-id': 'req_4YTbrzQTpySHjX',
[payments]     'stripe-version': '2022-11-15',
[payments]     'strict-transport-security': 'max-age=63072000; includeSubDomains; preload'
[payments]   },
[payments]   requestId: 'req_4YTbrzQTpySHjX',
[payments]   statusCode: 400,
[payments]   charge: undefined,
[payments]   decline_code: undefined,
[payments]   payment_intent: undefined,
[payments]   payment_method: undefined,
[payments]   payment_method_type: undefined,
[payments]   setup_intent: undefined,
[payments]   source: undefined
[payments] }
```

### 480. Automated Payment Testing

- Option #1. actually connect the real stripe api
- Option #2. mock stripe api

> we will look into both options

```ts
export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({}),
  },
};

// We're expecting a value
await stripe.charges.create({
  currency: 'aud',
  amount: order.price * 100,
  source: token,
});
```

### 483. Realistic Test Implementation

- [Stripe API Documentation - retrieve a charge](https://stripe.com/docs/api/charges/retrieve)
- [Stripe API Documentation - list all charges](https://stripe.com/docs/api/charges/list)

### 486. Publishing a Payment Created Event

```sh
# udemy/microservices-node-react/dwktickets-npm/commmon
npm run pub
# + @dwktickets/common@1.0.13

# payments, orders, tickets, (auth, expiration)
# update package.json first, skaffold will install the version defined in package.json
# "@dwktickets/common": "^1.0.13",
npm update @dwktickets/common
```

### 493. Reminder on Data Fetching with Next

on the LandingPage, there are two requests to get the current user\
one from \_app.js and one from index.js(Landing page)\
we need to fix it to request only once

### 504. Showing a Stripe Payment Form

```sh
# ticketing/client
npm install react-stripe-checkout
```

### 505. Configuring Stripe

```sh
# ticketing/client
npm install prop-types
```

### 506. Test Credit Card Numbers

[Stripe API - testing card numbers](https://stripe.com/docs/testing#cards)

- Visa
  - Number: 4242 4242 4242 4242
  - CVC: any 3 digits

</details>
