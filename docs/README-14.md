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

</details>
