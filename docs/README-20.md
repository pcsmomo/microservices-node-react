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
- **Options #4. Use `bull.js`**
  - `bull.js` allows us to set up long live timers
  - `bull.js` store the message to redis instance

### 442. Initial Setup

```sh
# ticketing
mkdir expiration
cd expiration

# and copy some files from `tickets` service
```

</details>
