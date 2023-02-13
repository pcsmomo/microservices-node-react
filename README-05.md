# Details

<details open> 
  <summary>Click to Contract/Expend</summary>

## Section 5 - Architecture of Multi-Service Apps

### 106. Big Ticket Items

Painful Things from App #1 (blog)

1. Lots of duplicated code
   - Solution) Build a central library as an NPM module to share code between our different projects
2. Really hard to picture the flow of events between services
   - Solution) Precisely define all our events in this shared library
3. Really hard to remember what properties an event should have
   - Solution) Write everything in Typescript
4. Really hard to test some event flows
   - Solution) Write tests for as much as possible/reasonable
5. My machine is getting laggy running kubernetes and everything else...
   - Solution) Run a k8s cluster in the cloud and develop on it almost as quickly as local
6. What if someone created a comment after editing 5 others after editing a post while balancing on a tight rope...
   - Solution) Introduce a lot of code to handle concurrency issues

### 107. App Overview

We will build something like [Stubhub.com](https://www.stubhub.com/)

1. Users can list a ticket for an event (convert, sports) for sale
2. Other users can purchase this ticket
3. Any user can list tickets for sale and purchase tickets
4. When a user attempts to purchase a ticket, the ticket is "locked" for 15 minutes. The user has 15 minutes to enter their payment info.
5. While locked, no other user can purchase the ticket. After 15 minutes, the ticket should "unlock"
6. Ticket prices can be edited if they are not locked

### 108. Resource Types

- User
  - email: string
  - password: string
- Ticket
  - title: string
  - price: number
  - userId: Ref to User
  - orderId: Ref to Order
- Order
  - userId: Ref to User
  - status: Created | Cancelled | AwaitingPayment | Completed
  - ticketId: Ref to Ticket
  - expiresAt: Date
- Charge
  - orderId: Ref to Order
  - status: Created | Failed | Completed
  - amount: number
  - stripeId: string
  - stripeRefundId: string

### 109. Service Types

- auth: Everything related to user signup/signin/signout
- tickets: Ticket creation/editing. Knows whether a ticket can be updated
- orders: Order creation/editing
- expiration: Watchers for orders to be created, cancels them after 15 minutes
- payments: Handles credit card payments. cancels orders if payments fails, completes if payment succeeds

### 110. Events and Architecture Design

![second app architecture](./resources/110-second-app-architecture-design.jpeg)

### 112. Auth Service Setup

```sh
mkdir ticketing
cd ticketing
mkdir auth
cd auth
npm init -y
npm install typescript ts-node-dev express @types/express
npm install -g typescript
tsc --init

npm start
# > auth@1.0.0 start
# > ts-node-dev src/index.ts

# [INFO] 17:52:15 ts-node-dev ver. 2.0.0 (using ts-node ver. 10.9.1, typescript ver. 4.9.5)
# Listening on port 3000!
```

### 113. Auth K8s Setup

```sh
# ticketing/auth
docker build -t pcsmomo/auth .
```

```sh
# ticketing
mkdir -p infra/k8s
cd infra/k8s
touch auth-depl.yaml
kubectl apply -f auth-depl.yaml
```

</details>
