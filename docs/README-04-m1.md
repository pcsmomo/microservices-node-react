# Details

<details open> 
  <summary>Click to Contract/Expend</summary>

## Section 4 - Orchestrating Collections of Services with Kubernetes

### 64. Installing Kubernetes

Click Docker Icon on the tray -> Preferences -> Kubernetes -> Enable Kubernetes

> However, I'm enabling kubernetes from docker desktop\
> (it take too long to enable/disable for me)\
> running command `minikube start --driver=docker`

### 65. IMPORTANT Note for Minikube and MicroK8s Users

1. Minikube Users

Recent versions of Minikube will use the docker driver by default when you run `minikube start`. On Windows or macOS, **the docker driver is not compatible with an ingress**, which we will be using throughout the course.

To avoid this issue, you can pass the `--driver` flag with a specific driver or `--vm=true`

- Mac OS
  ```sh
  # macOS:
  minikube start --vm=true
  minikube start --driver=hyperkit  # cannot install it on m1
  minikube start --driver=virtualbox    # cannot install it on m1
  ```
- Windows
  - Windows students should be using Docker Desktop with WSL2 and not Minikube. A VM driver will not work since it would require virtualization that is in conflict with WSL2.

2. MicroK8s Users

This course does not support the use of MicroK8s and will likely not work in the way that is presented. We highly suggest the use of Docker Desktop for macOS and Windows users and Minikube for Linux users. If you choose to use MicroK8s you will need to do your own research and refactoring to resolve the issues that may arise.

### 66. A Kubernetes Tour

```sh
kubectl version
# WARNING: This version information is deprecated and will be replaced with the output from kubectl version --short.  Use --output=yaml|json to get the full version.
# Client Version: version.Info{Major:"1", Minor:"26", GitVersion:"v1.26.1", GitCommit:"8f94681cd294aa8cfd3407b8191f6c70214973a4", GitTreeState:"clean", BuildDate:"2023-01-18T15:51:24Z", GoVersion:"go1.19.5", Compiler:"gc", Platform:"darwin/arm64"}
# Kustomize Version: v4.5.7
# Server Version: version.Info{Major:"1", Minor:"26", GitVersion:"v1.26.1", GitCommit:"8f94681cd294aa8cfd3407b8191f6c70214973a4", GitTreeState:"clean", BuildDate:"2023-01-18T15:51:25Z", GoVersion:"go1.19.5", Compiler:"gc", Platform:"linux/arm64"}
```

At first it shows `Unable to connect to the server`.\
It will be solved after `minikube start --driver=docker` as it will install the server and change the config

```sh
kubectl config view

kubectl version --short
# Flag --short has been deprecated, and will be removed in the future. The --short output will become the default.
# Client Version: v1.26.1
# Kustomize Version: v4.5.7
# Server Version: v1.26.1

minikube start --vm=docker
# 😄  minikube v1.29.0 on Darwin 13.1 (arm64)
# ✨  Using the docker driver based on existing profile
# 👍  Starting control plane node minikube in cluster minikube
# 🚜  Pulling base image ...
# 🏃  Updating the running docker "minikube" container ...

# 🧯  Docker is nearly out of disk space, which may cause deployments to fail! (86% of capacity). You can pass '--force' to skip this check.
# 💡  Suggestion:

#     Try one or more of the following to free up space on the device:

#     1. Run "docker system prune" to remove unused Docker data (optionally with "-a")
#     2. Increase the storage allocated to Docker for Desktop by clicking on:
#     Docker icon > Preferences > Resources > Disk Image Size
#     3. Run "minikube ssh -- docker system prune" if using the Docker container runtime
# 🍿  Related issue: https://github.com/kubernetes/minikube/issues/9024

# 🐳  Preparing Kubernetes v1.26.1 on Docker 20.10.23 ...
# 🔎  Verifying Kubernetes components...
#     ▪ Using image docker.io/kubernetesui/dashboard:v2.7.0
#     ▪ Using image docker.io/kubernetesui/metrics-scraper:v1.0.8
# 💡  After the addon is enabled, please run "minikube tunnel" and your ingress resources would be available at "127.0.0.1"
#     ▪ Using image gcr.io/k8s-minikube/storage-provisioner:v5
#     ▪ Using image registry.k8s.io/ingress-nginx/controller:v1.5.1
#     ▪ Using image registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20220916-gd32f8c343
#     ▪ Using image registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20220916-gd32f8c343
# 💡  Some dashboard features require the metrics-server addon. To enable all features please run:

# 	minikube addons enable metrics-server


# 🔎  Verifying ingress addon...
# 🌟  Enabled addons: storage-provisioner, default-storageclass, dashboard, ingress
# 🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
```

- Mater
  - Service
    - Node
      - Pod (= Container)
      - Pod and Container are technically different, but we will use one to one mapping

### 67. Important Kubernetes Terminology

- Kubernetes Cluster : A collections of nodes + a master to manage them
- Node: A Virtual machine that will run our containers
- Pod: More or less a running container. Technically, a pod can run multiple containers (we won't do this)
- Deployment: Monitors a set of pods, make sure they are running and restarts them if they crash
- Service: Provides **an easy-to-remember URL** to access a running container

## 68. Notes on Config Files

> Do not create Objects without _config_ files. Config files provide a precise definition of what your cluster is running.\
> Kubernetes docs will tell you to run direct commands to create objects - only do this for testing purposes

### 69. Creating a Pod

```sh
# blog/posts
docker build -t pcsmomo/posts:0.0.1 .
```

```sh
# blog/infra/k8s
kubectl apply -f posts-pod.old.yaml
# pod/posts created
kubectl get pods  # Failed
# NAME    READY   STATUS              RESTARTS   AGE
# posts   0/1     ErrImageNeverPull   0          2s
```

### 70. ErrImagePull, ErrImageNeverPull and ImagePullBackoff Errors

- Minikube Users:

If you are using a vm driver, you will need to tell Kubernetes to use the Docker daemon running inside of the single node cluster instead of the host.

Run the following command:

`eval $(minikube docker-env)`

Note - This command will need to be repeated anytime you close and restart the terminal session.

Afterward, you can build your image:

`docker build -t USERNAME/REPO .`

Update, your pod manifest as shown above and then run:

`kubectl apply -f infra/k8s/`

[minikube docker-env](https://minikube.sigs.k8s.io/docs/commands/docker-env/)

```sh
# ./blog
eval $(minikube docker-env)
docker build -t pcsmomo/posts:0.0.1 posts/
kubectl apply -f infra/k8s/posts-pod.old.yaml
kubectl get pods
# NAME    READY   STATUS    RESTARTS   AGE
# posts   1/1     Running   0          8m29s
```

### 71. Understanding a Pod Spec

`image: pcsmomo/posts` or `image: pcsmomo/posts:latest` \
if we don't specify the tag, it will try to reach docker hub to find the image:latest \
and in our case, we will get an error as we didn't push our image to docker hub

### 72. Common Kubectl Commands

```sh
kubectl exec -it posts -- sh
ls
# if we run more than two containers in a pod, we need to specify which container we want to execute
kubectl logs posts
```

### 75. Creating a Deployment

```sh
kubectl apply -f posts-depl.yaml
```

### 76. Common Commands Around Deployments

```sh
k apply -f posts-depl.yaml
# deployment.apps/posts-depl created
k get deployment
# NAME         READY   UP-TO-DATE   AVAILABLE   AGE
# posts-depl   1/1     1            1           6s
k get pods
# NAME                        READY   STATUS    RESTARTS   AGE
# posts-depl-7f649dfc-pwb9s   1/1     Running   0          15s
k get pods
# NAME                        READY   STATUS              RESTARTS   AGE
# posts-depl-7f649dfc-5hgl2   0/1     ContainerCreating   0          3s
k get pods --watch
# NAME                        READY   STATUS    RESTARTS   AGE
# posts-depl-7f649dfc-5hgl2   1/1     Running   0          6s
```

### 77. Updating Deployments

Updating the image used by a deployment

1. Method #1 - using local
   1. 'blog/posts': update index.js code
   2. 'blog/posts': rebuild: `docker build -t pcsmomo/posts:0.0.2 .`
   3. 'blog/infra/k8s': update `posts-depl.yaml` file
      `image: pcsmomo/posts:0.0.2`
   4. 'blog/infra/k8s':apply `kubectl apply -f posts-depl.yaml `

> Howover, this method is not really useful because we need to manually change the tag version on the yaml file

### 78. Preferred Method for Updating Deployments

2. \*Method #2 - using docker hub
   1. 'blog/infra/k8s': using 'latest' or remove tag in the pod spec section
      `image: pcsmomo/posts`
   2. 'blog/posts': update index.js code
   3. 'blog/posts': rebuild: `docker build -t pcsmomo/posts .`
   4. push to the docker hub `docker push pcsmomo/posts`
      - `docker login -u pcsmomo` before push
   5. 'blog/infra/k8s': run the commend
      - `kubectl rollout restart deployment [depl_name]`

```sh
kubectl get deployments
kubectl rollout restart deployment posts-depl
kubectl get deployments
kubectl get pods
# NAME                          READY   STATUS    RESTARTS   AGE
# posts-depl-776ccd8798-hzxq7   1/1     Running   0          37s
kubectl logs posts-depl-776ccd8798-hzxq7
```

### 79. Networking With Services

- \*Cluster IP
  - Set up easy-to-remember URL to access a pod.
  - Only exposes pods in the cluster
- Node Port
  - Makes a pod accessible from outside the cluster.
  - Usually only used for _dev_ purposes.
- \*Load Balancer
  - Makes a pod accessible from outside the cluster.
  - This is the right way to expose a pod to the outside world
- External Name
  - Redirects an in-cluster request to a CNAME url...
  - don't worry about this one

### 80. Creating a NodePort Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: posts-srv
spec:
  type: NodePort
  selector:
    app: posts # matching with deployment template labels
  ports:
    - name: posts # optional
      protocol: TCP
      port: 4000 # outer: port for service itself
      targetPort: 4000 # inter: to the pod
```

### 81. Accessing NodePort Services

```sh
# blog/infra/k8s
kubectl apply -f posts-srv.yaml
# service/posts-srv created
kubectl get services
# NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
# kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP          5d1h
# posts-srv    NodePort    10.98.216.86   <none>        4000:30097/TCP   59s
kubectl describe service posts-srv
# NodePort:                 posts  30097/TCP
minikube ip
# 192.168.49.2
minikube service posts-srv --url
```

- Docker for Mac/Windows -> `http://localhost:3xxxx/posts`
- Docker toolbox with Minikube -> `http://<minikube ip>:3xxxx/posts`

#### ⚠️ Trouble Shooting

[Minikube accessing app](https://minikube.sigs.k8s.io/docs/handbook/accessing/)

```sh
minikube service posts-srv --url
# http://127.0.0.1:53052
# ❗  Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
```

### 82. Setting Up Cluster IP Services

- Posts Pod -> Cluster IP service for Event Bus -> Event Bus Pod
- Event Bus Pod -> Cluster IP service for Posts -> Posts Pod

### 83. Building a Deployment for the Event Bus

1. Build an image for the Event Bus
2. Push the image to Docker hub
3. Create a deployment for Event Bus
4. Create a Cluster IP service for Event Bus and Posts
5. Wire it all up! -> 'localhost' to <service_name>

```sh
# blog/event-bus
docker build -t pcsmomo/event-bus .
docker push pcsmomo/event-bus
touch event-bus-depl.yaml
# blog/infra/k8s
kubectl apply -f event-bus-depl.yaml
# deployment.apps/event-bus-depl created
kubectl get pods
# NAME                              READY   STATUS    RESTARTS   AGE
# event-bus-depl-55f54dff69-4v9vf   1/1     Running   0          18s
# posts-depl-7f649dfc-gxsx2         1/1     Running   0          92m
```

### 84. Adding ClusterIP Services

```sh
kubectl apply -f event-bus-depl.yaml
# deployment.apps/event-bus-depl unchanged
# service/event-bus-srv created
kubectl apply -f posts-depl.yaml
# deployment.apps/posts-depl unchanged
# service/posts-clusterip-srv created
kubectl get services
# NAME                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
# event-bus-srv         ClusterIP   10.99.18.99     <none>        4005/TCP         94s
# kubernetes            ClusterIP   10.96.0.1       <none>        443/TCP          5d3h
# posts-clusterip-srv   ClusterIP   10.108.81.129   <none>        4000/TCP         34s
# posts-srv             NodePort    10.98.216.86    <none>        4000:30097/TCP   97m
```

### 86. Updating Service Addresses

Change the urls from `localhost:4xxx` -> `<service name>:4xxx`

```sh
# blog/event-bus
docker build -t pcsmomo/event-bus .
docker push pcsmomo/event-bus
# blog/posts
docker build -t pcsmomo/posts .
docker push pcsmomo/posts
# blog/infra/k8s
kubectl get deployments
# NAME             READY   UP-TO-DATE   AVAILABLE   AGE
# event-bus-depl   1/1     1            1           26m
# posts-depl       1/1     1            1           9h
kubectl rollout restart deployment posts-depl
# deployment.apps/posts-depl restarted
kubectl rollout restart deployment event-bus-depl
# deployment.apps/event-bus-depl restarted
kubectl get pods
# NAME                              READY   STATUS    RESTARTS   AGE
# event-bus-depl-7ddd999bd4-cmgz6   1/1     Running   0          11s
# posts-depl-546dbb95dc-f4q5f       1/1     Running   0          19s
```

### 87. Verifying Communication

```sh
kubectl exec -it posts-depl-94d556dcd-bqrdf sh
cat index.js
```

Send a post request to posts service using postman

```sh
minikube service posts-srv --url
# http://127.0.0.1:53052
# ❗  Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
```

```sh
k logs posts-depl-546dbb95dc-f4q5f
# Listening on 4000
# Event Received: PostCreated
```

### 88. Adding Query, Moderation and Comments

```sh
# blog/comments
docker build -t pcsmomo/comments .
docker push pcsmomo/comments
# blog/moderation
docker build -t pcsmomo/moderation .
docker push pcsmomo/moderation
# blog/query
docker build -t pcsmomo/query .
docker push pcsmomo/query

# blog/infra/k8s
kubectl apply -f .
# deployment.apps/comments-depl created
# service/comments-srv created
# deployment.apps/event-bus-depl created
# service/event-bus-srv created
# deployment.apps/moderation-depl created
# service/moderation-srv created
# deployment.apps/posts-depl created
# service/posts-clusterip-srv created
# pod/posts created
# service/posts-srv created
# deployment.apps/query-depl created
# service/query-srv created
kubectl get pods --watch
# NAME                              READY   STATUS    RESTARTS   AGE
# comments-depl-8d447b496-qddnk     1/1     Running   0          4m49s
# event-bus-depl-55f54dff69-wj54w   1/1     Running   0          4m49s
# moderation-depl-cb8d49798-ct2fj   1/1     Running   0          4m49s
# posts-depl-7f649dfc-4nsjg         1/1     Running   0          4m49s
# query-depl-c4bb58446-gdfqz        1/1     Running   0          4m49s
kubectl get services
# NAME                  TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
# comments-srv          ClusterIP   10.108.236.32    <none>        4001/TCP         82s
# event-bus-srv         ClusterIP   10.110.85.17     <none>        4005/TCP         82s
# kubernetes            ClusterIP   10.96.0.1        <none>        443/TCP          5d7h
# moderation-srv        ClusterIP   10.106.48.169    <none>        4003/TCP         82s
# posts-clusterip-srv   ClusterIP   10.102.222.241   <none>        4000/TCP         82s
# posts-srv             NodePort    10.99.206.69     <none>        4000:30765/TCP   82s
# query-srv             ClusterIP   10.100.202.247   <none>        4002/TCP         82s
```

### 90. Load Balancer Services

React App need to communicate with all services (except moderation)

1. Option #1
   - React App -> Node Port for each service
   - Probably not good
2. \*Option #2
   - React App -> Load Balancer Service -> Cluster IP for each service
   - Probably good

### 91. Load Balancers and Ingress

- Load Balancer Service Type
  - Tell Kubernetes to reach out to its provider and provision a load balancer
  - Gets traffic in to a single pod
  - Load Balancer is actually in a cloud provider
- Ingress or Ingress Controller
  - A pod with a set of **routing rules** to distribute traffic to other services

### 92. Important - DO NOT SKIP - Ingress Nginx Installation Info

We will be using [Ingress Nginx](https://kubernetes.github.io/ingress-nginx/), not [Nginx Ingress](https://docs.nginx.com/nginx-ingress-controller/)

### 93. Installing Ingress-Nginx

ingress-nginx

- [ingress-nginx Github](https://github.com/kubernetes/ingress-nginx)
- [ingress-nginx Doc](https://kubernetes.github.io/ingress-nginx/deploy)

> Note, not 'kubernetes-ingress'

#### Way 1 to install

```sh
minikube addons enable ingress
# 💡  ingress is an addon maintained by Kubernetes. For any concerns contact minikube on GitHub.
# You can view the list of minikube maintainers at: https://github.com/kubernetes/minikube/blob/master/OWNERS
# 💡  After the addon is enabled, please run "minikube tunnel" and your ingress resources would be available at "127.0.0.1"
#     ▪ Using image registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20220916-gd32f8c343
#     ▪ Using image registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20220916-gd32f8c343
#     ▪ Using image registry.k8s.io/ingress-nginx/controller:v1.5.1
# 🔎  Verifying ingress addon...
# 🌟  The 'ingress' addon is enabled
kubectl get all -n ingress-nginx
# NAME                                           READY   STATUS      RESTARTS      AGE
# pod/ingress-nginx-admission-create-rhr7d       0/1     Completed   0             2d8h
# pod/ingress-nginx-admission-patch-nrd6x        0/1     Completed   0             2d8h
# pod/ingress-nginx-controller-77669ff58-4xvfr   1/1     Running     1 (20h ago)   2d8h

# NAME                                         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
# service/ingress-nginx-controller             NodePort    10.97.172.57    <none>        80:31503/TCP,443:31729/TCP   2d8h
# service/ingress-nginx-controller-admission   ClusterIP   10.99.249.113   <none>        443/TCP                      2d8h

# NAME                                       READY   UP-TO-DATE   AVAILABLE   AGE
# deployment.apps/ingress-nginx-controller   1/1     1            1           2d8h

# NAME                                                 DESIRED   CURRENT   READY   AGE
# replicaset.apps/ingress-nginx-controller-77669ff58   1         1         1       2d8h

# NAME                                       COMPLETIONS   DURATION   AGE
# job.batch/ingress-nginx-admission-create   1/1           22s        2d8h
# job.batch/ingress-nginx-admission-patch    1/1           22s        2d8h
```

#### Way 2 to manually install (Optional)

```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/cloud/deploy.yaml
```

look at [the config file](https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/cloud/deploy.yaml) to see what's going on

### 95. Writing Ingress Config Files

```sh
kubectl apply -f ingress-srv.yaml
# ingress.networking.k8s.io/ingress-srv created

kubectl get ing
# NAME          CLASS    HOSTS       ADDRESS        PORTS   AGE
# ingress-srv   <none>   posts.com   192.168.49.2   80      4m26s
```

### 96. Important Note About Port 80

```sh
sudo lsof -i tcp:80
```

### 97. Hosts File Tweak

```sh
# open minikube tunnul on the other terminal
minikube tunnel
```

```sh
sudo vim /etc/hosts
# add this
# 127.0.0.1 posts.com
```

Navigate posts.com/posts -> It works this time!!

### 98. Important Note to Add Environment Variable

- [[React-Scripts] v3.4.1 fails to start in Docker #8688](https://github.com/facebook/create-react-app/issues/8688)
- [WebSocket connection to 'ws://localhost:3000/ws' failed: #11779](https://github.com/facebook/create-react-app/issues/11779)

```yaml
# blog/client/Dockerfile
FROM node:16-alpine

# Add the following lines
ENV CI=true
ENV WDS_SOCKET_PORT=0

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]
```

### 99. Deploying the React App

```sh
# blog/client
docker build -t pcsmomo/client .
docker push pcsmomo/client
# blog/infra/k8s
kubectl apply -f client-depl.yaml
# deployment.apps/client-depl created
# service/client-srv created
```

### 100. Unique Route Paths

Now client can access backend via Ingress\
But the problem is that Ingress doesn't distinguish methods such as POST and GET

- posts: POST /posts
- query: GET /posts

We need to modify them to unique routh paths

- posts: POST /posts -> /posts/create
- query: GET /posts

```sh
# blog/client
docker build -t pcsmomo/client .
docker push pcsmomo/client
# blog/posts
docker build -t pcsmomo/posts .
docker push pcsmomo/posts
# blog/infra/k8s
kubectl rollout restart client-depl.yaml
kubectl rollout restart posts-depl.yaml
```

> Whenever we change code then we have to rebuild/redeploy and rollout again.\
> This is painful.
> There will be a solution for this soon in this lecture!

### 100. Final Route Config

- for `/posts/:id/comments`, nginx doesn't support wild card thing
  - so we need to use regular expression, `/posts/?(.*)/comments`
- client has to have all rest paths, so it needs to be defined at the last
  ```yaml
  - path: /?(.*)
    pathType: Prefix
    backend:
      service:
        name: client-srv
        port:
          number: 3000
  ```

```sh
# blog/infra/k8s
kubectl apply -f ingress-srv.yaml
# ingress.networking.k8s.io/ingress-srv configured
```

Navigate http://posts.com/ and create a new post / refresh / create a new comment / refresh

All Good!

### 102. Introducing Skaffold

Skaffold - when code changes, it applies to the pod (...nodemon?)

- Automates many tasks in a Kubernetes dev environment
- Makes it really easy to update code in a running pod
- Makes it really easy to create/delete all objects tied to a proejct at once
- [skaffold.dev](https://skaffold.dev/)
- [Skaffold Documentation](https://skaffold.dev/docs/)

```sh
brew install skaffold
skaffold
# A tool that facilitates continuous development for Kubernetes applications.
#   Find more information at: https://skaffold.dev/docs/getting-started/
# End-to-end Pipelines:
#   run               Run a pipeline
#   dev               Run a pipeline in development mode
#   debug             Run a pipeline in debug mode

# ...

# Usage:
#   skaffold [flags] [options]

# Use "skaffold <command> --help" for more information about a given command.
# Use "skaffold options" for a list of global command-line options (applies to all commands).
```

### 103. Skaffold Setup

#### manifests

```yaml
apiVersion: skaffold/v2alpha3
kubectl:
  manifests:
    - ./infra/k8s/*
```

These 3 lines do 3 things

- when skaffold starts running, apply all yaml config files
- when config files change, apply it
- when skaffold stops, delete all objects related to the config files

#### build

```yaml
build:
  local:
    # default is true, pushing docker image
    push: false
```

#### sync

```yaml
sync:
  manual:
    - src: 'src/**/*.js'
      dest: .
```

- when `src/**/*.js` code changes, skaffold throw the changes to the pod directly
- when the others changes, skaffold rebuild the image and rollout restart

### 104. First Time Skaffold Startup

the first run will take a few minutes as it build all images again\
and the first run might fail

```sh
# first attempt
skaffold dev
# Generating tags...
#  - pcsmomo/client -> pcsmomo/client:d5b4244
#  - pcsmomo/comments -> pcsmomo/comments:d5b4244
#  - pcsmomo/event-bus -> pcsmomo/event-bus:d5b4244
#  - pcsmomo/moderation -> pcsmomo/moderation:d5b4244
#  - pcsmomo/posts -> pcsmomo/posts:d5b4244
#  - pcsmomo/query -> pcsmomo/query:d5b4244
# Checking cache...
#  - pcsmomo/client: Not found. Building
#  - pcsmomo/comments: Not found. Building
#  - pcsmomo/event-bus: Not found. Building
#  - pcsmomo/moderation: Not found. Building
#  - pcsmomo/posts: Not found. Building
#  - pcsmomo/query: Not found. Building
# Starting build...
# Found [minikube] context, using local docker daemon.
# Building [pcsmomo/comments]...
# Target platforms: [linux/arm64]
# #1 [internal] load build definition from Dockerfile
# #1 sha256:011cee10c01c93da655f80321f685cc6df204e6ede2d4963d29e38942ecaae90
# #1 transferring dockerfile: 145B done
# #1 DONE 0.0s
#
# ...
#
# Build [pcsmomo/query] succeeded
# Tags used in deployment:
#  - pcsmomo/client -> pcsmomo/client:abdfedc2ac83dc1ba5c930a8adf08d2593b68603865e68b6571d96a395e7c2f7
#  - pcsmomo/comments -> pcsmomo/comments:10f7203cb086ef81c3eede72cc1616f50db3071e59f5c0bc5674d28623020971
#  - pcsmomo/event-bus -> pcsmomo/event-bus:2500aefcc0ec75a8d3c7abc4c5cde5ca50483aba27b2209b48e24dc2b08190b0
#  - pcsmomo/moderation -> pcsmomo/moderation:fdd15116b1e01b7996689ca6b9b87d899bb001696f0a1fa9e4c89f921f56fcbe
#  - pcsmomo/posts -> pcsmomo/posts:8c308cf50a5db4ecea2fd7cd7024c5ec379d2b0f755e0c843e074433c159dc73
#  - pcsmomo/query -> pcsmomo/query:b412fe60c83f1f8f8fb28db9606e0835798e70b422fc921acb4d9ab84067254b
# Starting deploy...
#  - deployment.apps/client-depl configured
#  - service/client-srv configured
#  - deployment.apps/comments-depl configured
#  - service/comments-srv configured
#  - deployment.apps/event-bus-depl configured
#  - service/event-bus-srv configured
#  - ingress.networking.k8s.io/ingress-srv unchanged
#  - deployment.apps/moderation-depl configured
#  - service/moderation-srv configured
#  - deployment.apps/posts-depl configured
#  - service/posts-clusterip-srv configured
#  - service/posts-srv configured
#  - deployment.apps/query-depl configured
#  - service/query-srv configured
# Waiting for deployments to stabilize...
#  - deployment/client-depl: creating container client
#     - pod/client-depl-79c945579f-rrtb2: creating container client
#  - deployment/comments-depl: creating container comments
#     - pod/comments-depl-5454b4b9fc-wqh5h: creating container comments
#  - deployment/event-bus-depl: creating container event-bus
#     - pod/event-bus-depl-85756bcc88-zxtlg: creating container event-bus
#  - deployment/moderation-depl: creating container moderation
#     - pod/moderation-depl-55b4c76974-s9spq: creating container moderation
#  - deployment/posts-depl: creating container posts
#     - pod/posts-depl-c56cfc99c-9zkbk: creating container posts
#  - deployment/query-depl: creating container query
#     - pod/query-depl-78bf8dfd77-xhsv7: creating container query
#  - deployment/event-bus-depl: container event-bus is waiting to start: pcsmomo/event-bus:2500aefcc0ec75a8d3c7abc4c5cde5ca50483aba27b2209b48e24dc2b08190b0 can't be pulled
#     - pod/event-bus-depl-85756bcc88-zxtlg: container event-bus is waiting to start: pcsmomo/event-bus:2500aefcc0ec75a8d3c7abc4c5cde5ca50483aba27b2209b48e24dc2b08190b0 can't be pulled
#  - deployment/event-bus-depl failed. Error: container event-bus is waiting to start: pcsmomo/event-bus:2500aefcc0ec75a8d3c7abc4c5cde5ca50483aba27b2209b48e24dc2b08190b0 can't be pulled.
# I0213 07:45:47.151543    7369 request.go:668] Waited for 1.139430542s due to client-side throttling, not priority and fairness, request: GET:https://127.0.0.1:59700/apis/apps/v1/namespaces/default/replicasets?labelSelector=app%!D(MISSING)query
# Cleaning up...
#  - deployment.apps "client-depl" deleted
#  - service "client-srv" deleted
#  - deployment.apps "comments-depl" deleted
#  - service "comments-srv" deleted
#  - deployment.apps "event-bus-depl" deleted
#  - service "event-bus-srv" deleted
#  - ingress.networking.k8s.io "ingress-srv" deleted
#  - deployment.apps "moderation-depl" deleted
#  - service "moderation-srv" deleted
#  - deployment.apps "posts-depl" deleted
#  - service "posts-clusterip-srv" deleted
#  - service "posts-srv" deleted
#  - deployment.apps "query-depl" deleted
#  - service "query-srv" deleted
# 1/6 deployment(s) failed
```

### 105. A Few Notes on Skaffold

```sh
# second attempt, gracefully works!
skaffold dev
# Generating tags...
#  - pcsmomo/client -> pcsmomo/client:d5b4244
#  - pcsmomo/comments -> pcsmomo/comments:d5b4244
#  - pcsmomo/event-bus -> pcsmomo/event-bus:d5b4244
#  - pcsmomo/moderation -> pcsmomo/moderation:d5b4244
#  - pcsmomo/posts -> pcsmomo/posts:d5b4244
#  - pcsmomo/query -> pcsmomo/query:d5b4244
# Checking cache...
#  - pcsmomo/client: Found Locally
#  - pcsmomo/comments: Found Locally
#  - pcsmomo/event-bus: Found Locally
#  - pcsmomo/moderation: Found Locally
#  - pcsmomo/posts: Found Locally
#  - pcsmomo/query: Found Locally
# Tags used in deployment:
#  - pcsmomo/client -> pcsmomo/client:abdfedc2ac83dc1ba5c930a8adf08d2593b68603865e68b6571d96a395e7c2f7
#  - pcsmomo/comments -> pcsmomo/comments:10f7203cb086ef81c3eede72cc1616f50db3071e59f5c0bc5674d28623020971
#  - pcsmomo/event-bus -> pcsmomo/event-bus:2500aefcc0ec75a8d3c7abc4c5cde5ca50483aba27b2209b48e24dc2b08190b0
#  - pcsmomo/moderation -> pcsmomo/moderation:fdd15116b1e01b7996689ca6b9b87d899bb001696f0a1fa9e4c89f921f56fcbe
#  - pcsmomo/posts -> pcsmomo/posts:8c308cf50a5db4ecea2fd7cd7024c5ec379d2b0f755e0c843e074433c159dc73
#  - pcsmomo/query -> pcsmomo/query:b412fe60c83f1f8f8fb28db9606e0835798e70b422fc921acb4d9ab84067254b
# Starting deploy...
#  - deployment.apps/client-depl created
#  - service/client-srv created
#  - deployment.apps/comments-depl created
#  - service/comments-srv created
#  - deployment.apps/event-bus-depl created
#  - service/event-bus-srv created
#  - ingress.networking.k8s.io/ingress-srv created
#  - deployment.apps/moderation-depl created
#  - service/moderation-srv created
#  - deployment.apps/posts-depl created
#  - service/posts-clusterip-srv created
#  - service/posts-srv created
#  - deployment.apps/query-depl created
#  - service/query-srv created
# Waiting for deployments to stabilize...
#  - deployment/client-depl is ready. [5/6 deployment(s) still pending]
#  - deployment/comments-depl is ready. [4/6 deployment(s) still pending]
#  - deployment/event-bus-depl is ready. [3/6 deployment(s) still pending]
#  - deployment/moderation-depl is ready. [1/6 deployment(s) still pending]
#  - deployment/posts-depl is ready. [2/6 deployment(s) still pending]
#  - deployment/query-depl is ready.
# Deployments stabilized in 4.103 seconds
# Listing files to watch...
#  - pcsmomo/client
#  - pcsmomo/comments
#  - pcsmomo/event-bus
#  - pcsmomo/moderation
#  - pcsmomo/posts
#  - pcsmomo/query
# Press Ctrl+C to exit
# Watching for changes...
# [event-bus]
# [event-bus] > event-bus@1.0.0 start
# [event-bus] > nodemon index.js
# [event-bus]
# [event-bus] [nodemon] 2.0.20
# [event-bus] [nodemon] to restart at any time, enter `rs`
# [event-bus] [nodemon] watching path(s): *.*
# [event-bus] [nodemon] watching extensions: js,mjs,json
# [event-bus] [nodemon] starting `node index.js`
# [event-bus] Listening on 4005
# [moderation]
```

Try to change a few code and see what happens

```sh
# After change client code
# Syncing 1 files for pcsmomo/client:abdfedc2ac83dc1ba5c930a8adf08d2593b68603865e68b6571d96a395e7c2f7
# Watching for changes...
# [client] Compiled successfully!

# After change posts code
# Syncing 1 files for pcsmomo/posts:8c308cf50a5db4ecea2fd7cd7024c5ec379d2b0f755e0c843e074433c159dc73
# Watching for changes...
# [posts] [nodemon] restarting due to changes...
# [posts] [nodemon] starting `node index.js`
# [posts] v1000
# [posts] Listening on 4000
```

Stop skaffold (Ctrl + C)

```sh
# ^CCleaning up...
#  - deployment.apps "client-depl" deleted
#  - service "client-srv" deleted
#  - deployment.apps "comments-depl" deleted
#  - service "comments-srv" deleted
#  - deployment.apps "event-bus-depl" deleted
#  - service "event-bus-srv" deleted
#  - ingress.networking.k8s.io "ingress-srv" deleted
#  - deployment.apps "moderation-depl" deleted
#  - service "moderation-srv" deleted
#  - deployment.apps "posts-depl" deleted
#  - service "posts-clusterip-srv" deleted
#  - service "posts-srv" deleted
#  - deployment.apps "query-depl" deleted
#  - service "query-srv" deleted

# Help improve Skaffold with our 2-minute anonymous survey: run 'skaffold survey'
# To help improve the quality of this product, we collect anonymized usage data for details on what is tracked and how we use this data visit <https://skaffold.dev/docs/resources/telemetry/>. This data is handled in accordance with our privacy policy <https://policies.google.com/privacy>

# You may choose to opt out of this collection by running the following command:
# 	skaffold config set --global collect-metrics false
```

</details>

```sh
minikube start --driver=docker
eval $(minikube docker-env)
minikube addons enable ingress

minikube tunnel
skaffold dev
```
