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

</details>
