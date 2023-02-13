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

### 114. Adding Skaffold

```sh
skaffold dev
# Generating tags...
#  - pcsmomo/auth -> pcsmomo/auth:171117e
# Checking cache...
#  - pcsmomo/auth: Not found. Building
# Starting build...
# Found [minikube] context, using local docker daemon.
# Building [pcsmomo/auth]...
# Target platforms: [linux/arm64]
# #1 [internal] load build definition from Dockerfile
# #1 sha256:5611e45450ef857b9aa0b28522f72e9c345ad106f6ac34aeea51b89bd228b02b
# #1 transferring dockerfile: 139B done
# #1 DONE 0.0s

# #2 [internal] load .dockerignore
# #2 sha256:e67ca8bb01289b7f421b925e16c3d4f02f595d5b0265ada3ffa981dd8628ea73
# #2 transferring context: 52B done
# #2 DONE 0.0s

# #3 [internal] load metadata for docker.io/library/node:alpine
# #3 sha256:01f7ac29894dc09ece1f689cfed91ed78c6ade8e765955037bbf2141e10ca243
# #3 ...

# #4 [auth] library/node:pull token for registry-1.docker.io
# #4 sha256:f6fa87fe6caa66049b4c6ac2b94921eb7bfeee4724aaee59d183ec3283b17adc
# #4 DONE 0.0s

# #3 [internal] load metadata for docker.io/library/node:alpine
# #3 sha256:01f7ac29894dc09ece1f689cfed91ed78c6ade8e765955037bbf2141e10ca243
# #3 DONE 3.8s

# #7 [internal] load build context
# #7 sha256:71fc9160d130af5dcc98d6829f1cca2fcff7425ed3173c70ff74138b6d6a5418
# #7 transferring context: 97.09kB 0.0s done
# #7 DONE 0.0s

# #5 [1/5] FROM docker.io/library/node:alpine@sha256:992dd138340c189b2bc49d879cc4b328b12b8aa3480a43b1a05505a18987df3b
# #5 sha256:9c5c2f2c9325e2174d9dfcf74b5b6bc61e5779ff93eb7ab88fcc9f1eff344da5
# #5 resolve docker.io/library/node:alpine@sha256:992dd138340c189b2bc49d879cc4b328b12b8aa3480a43b1a05505a18987df3b 0.0s done
# #5 sha256:d77b59e456129ff5698df8098ec3f7cddd44279561235a4f7a16146aa1d91688 6.45kB / 6.45kB done
# #5 sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199 0B / 47.91MB 0.1s
# #5 sha256:2f06fa69ecc9bdcab10ba2c0aebadd52588adfd44136b7d8993d284e9ad7af2c 0B / 2.41MB 0.1s
# #5 sha256:d855d73c6edfdb80166e3ec6cc82fb5dc516144dd86f262e683dc6c37c40c700 0B / 449B 0.1s
# #5 sha256:992dd138340c189b2bc49d879cc4b328b12b8aa3480a43b1a05505a18987df3b 1.43kB / 1.43kB done
# #5 sha256:4e684e28830cc48da33333b8920dd245bbea87cc1aa32f146f866d604237ca9d 1.16kB / 1.16kB done
# #5 sha256:d855d73c6edfdb80166e3ec6cc82fb5dc516144dd86f262e683dc6c37c40c700 449B / 449B 1.3s done
# #5 sha256:2f06fa69ecc9bdcab10ba2c0aebadd52588adfd44136b7d8993d284e9ad7af2c 1.05MB / 2.41MB 2.1s
# #5 sha256:2f06fa69ecc9bdcab10ba2c0aebadd52588adfd44136b7d8993d284e9ad7af2c 2.10MB / 2.41MB 2.6s
# #5 sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199 3.15MB / 47.91MB 2.9s
# #5 sha256:2f06fa69ecc9bdcab10ba2c0aebadd52588adfd44136b7d8993d284e9ad7af2c 2.41MB / 2.41MB 2.7s done
# #5 sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199 6.29MB / 47.91MB 4.3s
# #5 sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199 9.44MB / 47.91MB 5.1s
# #5 sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199 12.58MB / 47.91MB 5.9s
# #5 sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199 15.73MB / 47.91MB 6.6s
# #5 sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199 18.87MB / 47.91MB 7.4s
# #5 sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199 22.02MB / 47.91MB 8.4s
# #5 sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199 25.17MB / 47.91MB 9.8s
# #5 sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199 28.31MB / 47.91MB 10.7s
# #5 sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199 31.46MB / 47.91MB 11.5s
# #5 sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199 34.60MB / 47.91MB 12.1s
# #5 sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199 37.75MB / 47.91MB 12.8s
# #5 sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199 40.89MB / 47.91MB 13.4s
# #5 sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199 44.04MB / 47.91MB 14.1s
# #5 sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199 47.19MB / 47.91MB 14.8s
# #5 sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199 47.91MB / 47.91MB 15.0s done
# #5 extracting sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199
# #5 extracting sha256:699fd767c7251194b5434340122d158f872613c61b85c821701ced8800616199 1.2s done
# #5 extracting sha256:2f06fa69ecc9bdcab10ba2c0aebadd52588adfd44136b7d8993d284e9ad7af2c
# #5 extracting sha256:2f06fa69ecc9bdcab10ba2c0aebadd52588adfd44136b7d8993d284e9ad7af2c 0.1s done
# #5 extracting sha256:d855d73c6edfdb80166e3ec6cc82fb5dc516144dd86f262e683dc6c37c40c700 done
# #5 DONE 16.5s

# #6 [2/5] WORKDIR /app
# #6 sha256:4c1974c02e7f8fb4ae32db3584c3f5b6e366015fc62efed968f192b35bca9fd1
# #6 DONE 0.3s

# #8 [3/5] COPY package.json .
# #8 sha256:e61b6245d8727eb9cf1a7e2c45bf067dc75aa33bace1748f7cdc1950d61a88f0
# #8 DONE 0.0s

# #9 [4/5] RUN npm install
# #9 sha256:8e5b75b5e4494a07c16b01ca7f84d8bc0be2e40691386bbd59a7d2ee21907e31
# #9 19.98
# #9 19.98 added 127 packages, and audited 128 packages in 20s
# #9 19.98
# #9 19.98 14 packages are looking for funding
# #9 19.98   run `npm fund` for details
# #9 19.98
# #9 19.98 found 0 vulnerabilities
# #9 19.98 npm notice
# #9 19.98 npm notice New patch version of npm available! 9.4.0 -> 9.4.2
# #9 19.98 npm notice Changelog: <https://github.com/npm/cli/releases/tag/v9.4.2>
# #9 19.98 npm notice Run `npm install -g npm@9.4.2` to update!
# #9 19.98 npm notice
# #9 DONE 20.1s

# #10 [5/5] COPY . .
# #10 sha256:58ba8b4947fef06abccf275b5c744034f651a3d72edcf342801cff82e507cc11
# #10 DONE 0.0s

# #11 exporting to image
# #11 sha256:e8c613e07b0b7ff33893b694f7759a10d42e180f2b4dc349fb57dc6b71dcab00
# #11 exporting layers
# #11 exporting layers 0.3s done
# #11 writing image sha256:d5b71c514b6a17ab94d967b1bf986c5e043b6596d2c6be0d2bee96eaf82caeb6 done
# #11 naming to docker.io/pcsmomo/auth:171117e done
# #11 DONE 0.3s

# Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
# Build [pcsmomo/auth] succeeded
# Tags used in deployment:
#  - pcsmomo/auth -> pcsmomo/auth:d5b71c514b6a17ab94d967b1bf986c5e043b6596d2c6be0d2bee96eaf82caeb6
# Starting deploy...
#  - deployment.apps/auth-depl created
#  - service/auth-srv created
# Waiting for deployments to stabilize...
#  - deployment/auth-depl is ready.
# Deployments stabilized in 1.071 second
# Listing files to watch...
#  - pcsmomo/auth
# Press Ctrl+C to exit
# Watching for changes...
# [auth]
# [auth] > auth@1.0.0 start
# [auth] > ts-node-dev src/index.ts
# [auth]
# [auth] [INFO] 07:03:42 ts-node-dev ver. 2.0.0 (using ts-node ver. 10.9.1, typescript ver. 4.9.5)
# [auth] Listening on port 3000!
```

Change `ticketing/auth/index.ts` and save the file

```sh
# Syncing 1 files for pcsmomo/auth:d5b71c514b6a17ab94d967b1bf986c5e043b6596d2c6be0d2bee96eaf82caeb6
# Watching for changes...
# [auth] Listening on port 3000!!!!!!
```

</details>
