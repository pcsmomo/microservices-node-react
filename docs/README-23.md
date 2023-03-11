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

Navigate `http://ticket.dev`\
and type "thisisunsafe" on the browser

## Section 23 - CI/CD

### 513. Git Repository Approaches

We're going to use mono repo\

Create a new repo and folder to use github

```sh
# udemy/microservices-node-react
mkdir ticketing-cicd
# Copy the ticketing project to the new folder
rsync -av --progress microservices-node-react-git/ticketing/ ./ticketing-cicd/ \
  --exclude node_modules --exclude playground --exclude postman

cd ticketing-cicd
git init
touch .gitignore

# Create new git repo

git remote add origin git@github.com:pcsmomo/ticketing.git
git push --set-upstream origin main
```

### 514. Creating a GitHub Action

Git repo -> Actions -> Manual Workflow

</details>
