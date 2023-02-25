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

## Section 14: NATS Streaming Server - An Event Bus Implementation

### 295. Three Important Items

- [NATS.io Docs](https://docs.nats.io/)
- [STAN aka 'NATS Streaming' Docs](https://docs.nats.io/legacy/stan)
- `NATS` and `NATS Streaming Server` are two different things
  - NATS Streaming Server is top of NATS and we will use NATS Streaming Server in this course
- NATS Streaming implements some extraordinarily important design decisions that will affect our app
- We are going to run the official `nats-streaming` docker image in kubernetes. Need to read the image's docs
  - https://hub.docker.com/_/nats-streaming : Commandline Options

> WARNING Deprecation Notice \
> The NATS Streaming Server is being deprecated. Critical bug fixes and security fixes will be applied until June of 2023.\
> NATS-enabled applications requiring persistence should use [JetStream](https://docs.nats.io/nats-concepts/jetstream).

### 297. Big Notes on NATS Streaming

[npm node-nats-streaming](https://www.npmjs.com/package/node-nats-streaming)

![NATS channel](../resources/297-1-nats-channel.png)

![NATS channel](../resources/297-2-nats-db.png)

### 298. Building a NATS Test Project

#### Short term goal

1. Create a new sub-project with typescript support
2. Install node-nats-streaming library and connect to nats streaming server
3. We should have two npm scripts, one to emit events, and one to listen for events
4. This program will be ran outside of kubernetes!

```sh
# ./ticketing
mkdir nats-test
cd nats-test
npm init -y
npm install node-nats-streaming ts-node-dev typescript @types/node

tsc --init
```

### 299. Port-Forwarding with Kubectl

- Option #1: Publisher Program - (Ingress-Nginx - NATS ClusterIP Service - NATS Pod)
  - a bit too heavy for our case
- Option #2: Publisher Program - (NodePort Service - NATS Pod)
  - creating a config file is still too much
- **Option #3**: Publisher Program - (Port-Forward Port 4222 - NATS Pod)
  - Great for temporary connection!!
  - Need to keep the terminal open

```sh
kubectl get pods
# NAME                                  READY   STATUS    RESTARTS   AGE
# ...
# nats-depl-689cdd9577-flmx7            1/1     Running   0          41m
kubectl port-forward nats-depl-689cdd9577-flmx7 4222:4222
# Forwarding from 127.0.0.1:4222 -> 4222
# Forwarding from [::1]:4222 -> 4222

# Keep the terminal open
```

```sh
# ./ticketing/nats-test
npm run publish
# [INFO] 22:56:46 ts-node-dev ver. 2.0.0 (using ts-node ver. 10.9.1, typescript ver. 4.9.5)
# Publisher connected to NATS
```

### 302. Listening For Data

```sh
# ./ticketing/nats-test
npm run listen
# Listener connected to NATS
```

On the publisher terminal, type `rs` and enter and repeat it a few more times

```sh
# ./ticketing/nats-test
npm run publish
rs
# Enter
```

The server restarts and it publishes a few more messages

### 304. Client ID Generation

Open a new terminal and run another listener

```sh
# ./ticketing/nats-test
npm run listen
# Error: Unhandled error. ('stan: clientID already registered')
```

Every connection has `clientID` and we've set the clientID, "123" for listener\
Now we want it random IDs

### 305. Queue Groups

It looks like as the same concept as Kafka Consumer Group

</details>
