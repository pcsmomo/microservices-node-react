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

### 516. Running Tests on PR Creation

Create a new branch 'dev' and create a PR for the change\
We will see the CI triggered.

### 521. Deployment Options

We will use Digital Ocean for deployment \
It is the cheapest one among 4 major services (AWS, Google cloud, Azure and digital ocean) \
And the easiest to use

### 522. Creating a Hosted Cluster

- Digital Ocean -> Create -> Kubernetes
  - Node plan ($12/Month : the smallest)
  - Number of Nodes : 2 (in production, 3 recommended)
  - Name: ticketing (default name is too long and hard to remember)

> 3 nodes \* $12 = $36\
> Loadbalancer = $10

### 523. Reminder on Kubernetes Context

[Digital Ocean CTL](https://github.com/digitalocean/doctl)

```sh
brew install doctl
doctl auth init
# Digital Ocean API token is needed
```

- Digital Ocean -> API -> Generate New Token
  - Token name: doctl

```sh
doctl auth init
# Enter your access token: <token> Enter
# or
doctl auth init -t <token>
# Validating token... ✔
doctl auth list
# default (current)
```

### 524. Reminder on Swapping Contexts

```sh
doctl kubernetes cluster kubeconfig save <cluster name>
doctl kubernetes cluster kubeconfig save ticketing
# Notice: Adding cluster credentials to kubeconfig file found in "/Users/noah/.kube/config"
# Notice: Setting current-context to do-syd1-ticketing

# or cluster id instead of cluster name is fine according to the document
```

```sh
kubectx
# do-syd1-ticketing
kubens
# default
# kube-node-lease
# kube-public
# kube-system
k get pods
# No resources found in default namespace.
```

```sh
# context test
k config view
# contexts:
# - context:
#     cluster: ""
#     user: ""
#   name: argocd-nana
# - context:
#     cluster: do-syd1-ticketing
#     user: do-syd1-ticketing-admin
#   name: do-syd1-ticketing
# - context:
#     cluster: gke_ticketing-dev-377721_australia-southeast1-a_ticketing-dev
#     user: gke_ticketing-dev-377721_australia-southeast1-a_ticketing-dev
#   name: gke_ticketing-dev-377721_australia-southeast1-a_ticketing-dev
# - context:
#     cluster: kimn
#     user: oidc-user
#   name: kimn
# - context:
#     cluster: specnetes
#     namespace: space-mex
#     user: oidc-user
#   name: specnetes

k config use-context argocd-nana
k config use-context do-syd1-ticketing
# (same) kubectx do-syd1-ticketing
```

### 526. Building an Image in an Action

```yaml
# deploy-auth.yaml
- run: docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
```

- Github Actions
  - new actions for `deploy-auth.yaml`
- Github -> Settings -> Security -> Secrets and variables -> Actions
  - New repository secret for docker username
    - name: DOCKER_USERNAME
    - Secret: pcsmomo
  - New repository secret for docker password
    - name: DOCKER_PASSWORD
    - Secret: my docker hub password

</details>
