# Details

<details open> 
  <summary>Click to Contract/Expend</summary>

# How to run

```sh
# Run docker desktop

# run minikube
minikube start --driver=docker
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

- Github Actions
  - new actions for `deploy-auth.yaml`
- Github -> Settings -> Security -> Secrets and variables -> Actions
  - New repository secret for docker username
    - name: DOCKER_USERNAME
    - Secret: pcsmomo
  - New repository secret for docker password
    - name: DOCKER_PASSWORD
    - Secret: my docker hub password

```yaml
# deploy-auth.yaml
- run: docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
  env:
    DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
    DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
```

### 527. Testing the Image Build

push anything to the main branch, it will triger the build action.\
which builds the auth image and push it to my docker hub

### 528. Restarting the Deployment

Add another secret in the github repo for digital ocean token

- Digital Ocean -> my project -> API -> Generate new personal access token
  - name: github_access_token
- Github -> Settings -> Security -> Secrets and variables -> Actions
  - New repository secret for digital ocean access token
    - name: DIGITALOCEAN_ACCESS_TOKEN
    - Secret: <digital ocean access token>

### 531. Manual Secret Creation

```sh
kubectl config view
kubectl config use-context do-syd1-ticketing

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=randomstring
kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=<Secret key: not public key>
```

### 532. Don't Forget Ingress-Nginx!

[ingress nginx - Digital Ocean installation](https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean)

```sh
kubectx
# do-syd1-ticketing
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.6.4/deploy/static/provider/do/deploy.yaml
# namespace/ingress-nginx created
# serviceaccount/ingress-nginx created
# serviceaccount/ingress-nginx-admission created
# role.rbac.authorization.k8s.io/ingress-nginx created
# role.rbac.authorization.k8s.io/ingress-nginx-admission created
# clusterrole.rbac.authorization.k8s.io/ingress-nginx created
# clusterrole.rbac.authorization.k8s.io/ingress-nginx-admission created
# rolebinding.rbac.authorization.k8s.io/ingress-nginx created
# rolebinding.rbac.authorization.k8s.io/ingress-nginx-admission created
# clusterrolebinding.rbac.authorization.k8s.io/ingress-nginx created
# clusterrolebinding.rbac.authorization.k8s.io/ingress-nginx-admission created
# configmap/ingress-nginx-controller created
# service/ingress-nginx-controller created
# service/ingress-nginx-controller-admission created
# deployment.apps/ingress-nginx-controller created
# job.batch/ingress-nginx-admission-create created
# job.batch/ingress-nginx-admission-patch created
# ingressclass.networking.k8s.io/nginx created
# validatingwebhookconfiguration.admissionregistration.k8s.io/ingress-nginx-admission created
```

Push the changes to the main branch\
-> Github actions `deploy-manifests` will be triggered

```sh
k get pods
# NAME                                     READY   STATUS              RESTARTS   AGE
# auth-depl-6bf9b6476b-s9hf9               0/1     ContainerCreating   0          13s
# auth-mongo-depl-67dc86686c-kvhhh         0/1     ContainerCreating   0          13s
# client-depl-76c68dc5c9-4smtz             0/1     ContainerCreating   0          12s
# expiration-depl-854b6fd55-5r7cj          0/1     ContainerCreating   0          11s
# expiration-redis-depl-5fdd8c6d8d-pp8pt   0/1     ContainerCreating   0          11s
# nats-depl-868b5ff766-gd5h5               0/1     ContainerCreating   0          10s
# orders-depl-6fdb7cd5dd-5ptvk             0/1     ContainerCreating   0          10s
# orders-mongo-depl-6568444645-sb6df       0/1     ContainerCreating   0          9s
# payments-depl-666f576b8b-czhxz           0/1     ContainerCreating   0          9s
# payments-mongo-depl-6cf56f89d9-kgdd7     0/1     ContainerCreating   0          8s
# tickets-depl-74d564f5db-2g6fh            0/1     ContainerCreating   0          8s
# tickets-mongo-depl-c545cc44c-fwrzl       0/1     ContainerCreating   0          7s
```

### 536. Buying a Domain Name

- Digital Ocean -> Networking -> Load Balancers

#### Purchasing domain

- [namecheap.com - domain](namecheap.com)
- ticketing-prod.site
  - http://ticketing-prod.site
- A$2.5 per year / no auto renewal

### 537. Three Important Changes Needed to Deploy - Do Not Skip!

> I am going to update this changes to my ticketing repository for cicd.\
> /Users/noah/Documents/study/study_codes/udemy/microservices-node-react/ticketing-cicd

#### Three Important Changes Needed to Deploy - Do Not Skip!

In the upcoming lecture, we will be configuring our project to use the new domain name that was purchased. There are 3 major things that need to be addressed in order for the deployment to work.

1. Update the baseURL in client service's build-client file:

In `api/build-client.js`, change the baseURL to your purchased domain:

From this:

```js
// We are on the server

return axios.create({
  baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
  headers: req.headers,
});
```

to:

```js
// We are on the server

return axios.create({
  baseURL: 'Whatever_your_purchased_domain_is',
  headers: req.headers,
});
```

Since I purchased ticketing-prod.site, I would update this line to:

baseURL: 'http://ticketing-prod.site'

2. Disable HTTPS Checking

You may recall that we configured all of our services to only use cookies when the user is on an HTTPS connection. This will cause auth to fail while we do the initial deployment of our app since we don't have HTTPS set up right now.

To disable the HTTPS checking, go to the `app.ts` file in the auth, orders, tickets, and payments services.

At the cookie-session middleware, change the following:

```ts
cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
});
```

to:

```ts
cookieSession({
  signed: false,
  secure: false,
});
```

3. Add Load Balancer

There is currently a bug with ingress-nginx on Digital Ocean. You can read more about this bug here: https://github.com/digitalocean/digitalocean-cloud-controller-manager/blob/master/docs/controllers/services/examples/README.md#accessing-pods-over-a-managed-load-balancer-from-inside-the-cluster

To fix it, add the following to the bottom of your ingress-srv.yaml manifest.

Also, update the URL on this line in the annotations to the domain name you're using:

service.beta.kubernetes.io/do-loadbalancer-hostname: 'www.ticketing-prod.site'

```yaml
# ./infra/k8s-prod/ingress.srv.yaml
---
apiVersion: v1
kind: Service
metadata:
  annotations:
    service.beta.kubernetes.io/do-loadbalancer-enable-proxy-protocol: 'true'
    service.beta.kubernetes.io/do-loadbalancer-hostname: 'www.ticketing-prod.site'
  labels:
    helm.sh/chart: ingress-nginx-2.0.3
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/instance: ingress-nginx
    app.kubernetes.io/version: 0.32.0
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/component: controller
  name: ingress-nginx-controller
  namespace: ingress-nginx
spec:
  type: LoadBalancer
  externalTrafficPolicy: Local
  ports:
    - name: http
      port: 80
      protocol: TCP
      targetPort: http
    - name: https
      port: 443
      protocol: TCP
      targetPort: https
  selector:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/instance: ingress-nginx
    app.kubernetes.io/component: controller
```

### 538. Configuring the Domain Name

#### Add digital ocean DNS to my domain setting

- Namecheap.com -> Domain List -> ticketing-prod.site -> Domain
  - Nameservers: Custom DNS
    - ns1.digitalocean.com
    - ns2.digitalocean.com
    - ns3.digitalocean.com
    - ✅ button click

### Add my purchased domain to Load Balancer setting

- Digital Ocean -> Networking -> Domains
  - Enter domain: ticketing-prod.site
    - Add Domain
  - Domain detail (ticketing-prod.site)
    - create two additional records
      - first one: `A`
        - Hostname: @
        - Will direct to: my load balancer (a2b0a126ca70b41d69ee1d12e9be01a6)
        - TTL: 30
      - second one: `CNAME`
        - Hostname: www
        - Is an alias of: @
        - TTL: 30

Push the branch and merge to main.

> Build failed... :(\
> Let's troubleshoot it

```sh
Error from server (InternalError): error when applying patch:
{"metadata":{"annotations":{"kubectl.kubernetes.io/last-applied-configuration":"{\"apiVersion\":\"networking.k8s.io/v1\",\"kind\":\"Ingress\",\"metadata\":{\"annotations\":{\"kubernetes.io/ingress.class\":\"nginx\",\"nginx.ingress.kubernetes.io/use-regex\":\"true\"},\"name\":\"ingress-service\",\"namespace\":\"default\"},\"spec\":{\"rules\":[{\"host\":\"www.ticketing-prod.site\",\"http\":{\"paths\":[{\"backend\":{\"service\":{\"name\":\"auth-srv\",\"port\":{\"number\":3000}}},\"path\":\"/api/users/?(.*)\",\"pathType\":\"Prefix\"},{\"backend\":{\"service\":{\"name\":\"tickets-srv\",\"port\":{\"number\":3000}}},\"path\":\"/api/tickets/?(.*)\",\"pathType\":\"Prefix\"},{\"backend\":{\"service\":{\"name\":\"orders-srv\",\"port\":{\"number\":3000}}},\"path\":\"/api/orders/?(.*)\",\"pathType\":\"Prefix\"},{\"backend\":{\"service\":{\"name\":\"payments-srv\",\"port\":{\"number\":3000}}},\"path\":\"/api/payments/?(.*)\",\"pathType\":\"Prefix\"},{\"backend\":{\"service\":{\"name\":\"client-srv\",\"port\":{\"number\":3000}}},\"path\":\"/?(.*)\",\"pathType\":\"Prefix\"}]}}]}}\n"}},"spec":{"rules":[{"host":"www.ticketing-prod.site","http":{"paths":[{"backend":{"service":{"name":"auth-srv","port":{"number":3000}}},"path":"/api/users/?(.*)","pathType":"Prefix"},{"backend":{"service":{"name":"tickets-srv","port":{"number":3000}}},"path":"/api/tickets/?(.*)","pathType":"Prefix"},{"backend":{"service":{"name":"orders-srv","port":{"number":3000}}},"path":"/api/orders/?(.*)","pathType":"Prefix"},{"backend":{"service":{"name":"payments-srv","port":{"number":3000}}},"path":"/api/payments/?(.*)","pathType":"Prefix"},{"backend":{"service":{"name":"client-srv","port":{"number":3000}}},"path":"/?(.*)","pathType":"Prefix"}]}}]}}
to:
Resource: "networking.k8s.io/v1, Resource=ingresses", GroupVersionKind: "networking.k8s.io/v1, Kind=Ingress"
Name: "ingress-service", Namespace: "default"
for: "infra/k8s-prod/ingress.srv.yaml": error when patching "infra/k8s-prod/ingress.srv.yaml": Internal error occurred: failed calling webhook "validate.nginx.ingress.kubernetes.io": failed to call webhook: Post "https://ingress-nginx-controller-admission.ingress-nginx.svc:443/networking/v1/ingresses?timeout=29s": EOF
service/ingress-nginx-controller configured
Error: Process completed with exit code 1.
```

> Next day, rebuild the `deploy-manifests.yaml` and it works.

### 540. Next Steps

#### Clean up Digital Ocean services

- Kubernetes cluster
- Load Balance

#### Next step

- Add in HTTPS
  - See [`cert-manager.io`](https://cert-manager.io/)
- Add in Email Support
  - Send a user an email after they have paid for an order. Create a new service using Mailchimp/Sendgrid/similar
- Add in 'build' steps for our prod cluster
  - Right now we are still running our services + the client in 'dev' mode.
  - Add in additional Dockerfiles to build each services prior to deployment
- Create a staging cluster
  - Our teammates might want to test out our app manually before we deploy it. Maybe we could add in a new Github workflow to watch for pushes to a new branch of 'staging'. Create a new cluster that you will deploy to when you push to this branch.

</details>

```sh
# set up for deployment
doctl auth init -t <token>
doctl kubernetes cluster kubeconfig save ticketing

# kubectl config use-context do-syd1-ticketing
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=randomstring
kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=<Secret key: not public key>
```
