# microservices-node-react

Microservices with Node JS and React by Stephen Grider

## Folder structure

- 02-mini-microservices-app
  - blog
    - client: create-react-app
    - posts
    - comments
    - event-bus
    - query
    - moderation
- 03-with-docker
  - blog : copied from the previous section
- 04-with-dubernetes
  - blog
    - infra
      - k8s: kubernetes
- 05-architecture-multi-service-app
- 06-cloud
- 07-normalization
- 08-database-modeling
- 09-authentication
- 10-testing
- 11-SSR-nextjs
- 12-code-sharing-reuse
- 13-CRUD-server-setup
- 14-NATS-streaming-server
- 15-connecting-NATS
- 16-NATS-client
- 17-cross-service-data-replication
- 18-event-flow
- 19-listener-concurrency
- 20-worker-services
- 21-payment
- 22-back-to-client
- 23-cicd
- 24-docker
  - 01-redis-image: start from lecture "547. Building a Dockerfile"
  - 02-simpleweb: "556. Project Outline"

# Details

[README-Section 1 to 3](./README-1-3.md)
[README-Appendix-Docker](./README-appx-docker.md)

<details open> 
  <summary>Click to Contract/Expend</summary>

## Section 4 - Orchestrating Collections of Services with Kubernetes

### 63. Installing Kubernetes

Click Docker Icon on the tray -> Preferences -> Kubernetes -> Enable Kubernetes

Currently Kubernetes v1.21.3

### 64. IMPORTANT Note for Minikube and MicroK8s Users

1. Minikube Users

Recent versions of Minikube will use the docker driver by default when you run `minikube start`. On Windows or macOS, **the docker driver is not compatible with an ingress**, which we will be using throughout the course.

To avoid this issue, you can pass the `--driver` flag with a specific driver or `--vm=true`

```sh
# macOS:
minikube start --vm=true
minikube start --driver=hyperkit
minikube start --driver=virtualbox

# Windows:
minikube start --vm=true
minikube start --driver=hyperv
minikube start --driver=virtualbox
```

2. MicroK8s Users

This course does not support the use of MicroK8s and will likely not work in the way that is presented. We highly suggest the use of Docker Desktop for macOS and Windows users and Minikube for Linux users. If you choose to use MicroK8s you will need to do your own research and refactoring to resolve the issues that may arise.

### 65. A Kubernetes Tour

```sh
kubectl version
# Client Version: version.Info{Major:"1", Minor:"21", GitVersion:"v1.21.2", GitCommit:"092fbfbf53427de67cac1e9fa54aaa09a28371d7", GitTreeState:"clean", BuildDate:"2021-06-16T12:59:11Z", GoVersion:"go1.16.5", Compiler:"gc", Platform:"darwin/amd64"}
# Unable to connect to the server: dial tcp: lookup 68FE2F410B3C62C1D26A3CF89A9FDEA0.gr7.ap-southeast-2.eks.amazonaws.com on 8.8.8.8:53: no such host
```

At first it shows `Unable to connect to the server`.\
It will be solved after `minikube start --vm=true` as it will install the server and change the config

```sh
kubectl config view

kubectl

minikube start --vm=true
# 😄  minikube v1.21.0 on Darwin 11.6
# 🎉  minikube 1.24.0 is available! Download it: https://github.com/kubernetes/minikube/releases/tag/v1.24.0
# 💡  To disable this notice, run: 'minikube config set WantUpdateNotification false'

# ✨  Automatically selected the hyperkit driver
# 💾  Downloading driver docker-machine-driver-hyperkit:
#     > docker-machine-driver-hyper...: 65 B / 65 B [----------] 100.00% ? p/s 0s
#     > docker-machine-driver-hyper...: 10.52 MiB / 10.52 MiB  100.00% 4.60 MiB p
# 🔑  The 'hyperkit' driver requires elevated permissions. The following commands will be executed:

#     $ sudo chown root:wheel /Users/noah/.minikube/bin/docker-machine-driver-hyperkit
#     $ sudo chmod u+s /Users/noah/.minikube/bin/docker-machine-driver-hyperkit


# Password:
# 💿  Downloading VM boot image ...
#     > minikube-v1.21.0.iso.sha256: 65 B / 65 B [-------------] 100.00% ? p/s 0s
#     > minikube-v1.21.0.iso: 243.03 MiB / 243.03 MiB [] 100.00% 5.51 MiB p/s 44s
# 👍  Starting control plane node minikube in cluster minikube
# 🔥  Creating hyperkit VM (CPUs=2, Memory=2200MB, Disk=20000MB) ...
# 🐳  Preparing Kubernetes v1.20.7 on Docker 20.10.6 ...
#     ▪ Generating certificates and keys ...
#     ▪ Booting up control plane ...
#     ▪ Configuring RBAC rules ...
# 🔎  Verifying Kubernetes components...
#     ▪ Using image gcr.io/k8s-minikube/storage-provisioner:v5
# 🌟  Enabled addons: default-storageclass, storage-provisioner
# 🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
```

- Mater
  - Service
    - Node
      - Pod (= Container)
      - Pod and Container are technically different, but we will use one to one mapping

### 66. Important Kubernetes Terminology

- Kubernetes Cluster : A collections of nodes + a master to manage them
- Node: A Virtual machine that will run our containers
- Pod: More or less a running container. Technically, a pod can run multiple containers (we won't do this)
- Deployment: Monitors a set of pods, make sure they are running and restarts them if they crash
- Service: Provides **an easy-to-remember URL** to access a running container

### 67. Notes on Config Files

> Do not create Objects without _config_ files. Config files provide a precise definition of what your cluster is running.\
> Kubernetes docs will tell you to run direct commands to create objects - only do this for testing purposes

### 68. Creating a Pod

```sh
# blog/posts
docker build -t pcsmomo/posts:0.0.1 .
```

```sh
# blog/infra/k8s
kubectl apply -f posts.yaml
# pod/posts created
kubectl get pods
# | NAME  | READY |      STATUS      | RESTARTS | AGE |
# | :---: | :---: | :--------------: | :------: | :-: |
# | posts |  0/1  | ImagePullBackOff |    0     | 35s |
```

### 69. ErrImagePull, ErrImageNeverPull and ImagePullBackoff Errors

```sh
# blog/infra/k8s
kubectl delete -f posts.yaml
# pod "posts" deleted
```

add `imagePullPolicy: Never` to posts.yaml

```sh
kubectl apply -f .
# pod/posts created
kubectl get pods
# NAME    READY   STATUS    RESTARTS   AGE
# posts   1/1     Running   0          3s
```

#### Probably...

I guess before delete and create, I did this too

```sh
eval $(minikube docker-env)
# Note - this comment will need to be repeated anytime you close and restart the terminal session
docker build -t USERNAME/REPO .
kubectl apply -f infra/k8s/
```

But turns out, I don't need to run that `eval` command, after testing

```yaml
# K8s is extensible - we can add in our own custom objects. This specifies the set of objects we want K8s to look at
apiVersion: v1

# The type of object we want to create
kind: Pod

# Config options for the object we are about to create
metadata:
  # When the pod is created, give it a name of 'posts'
  name: posts
# The exact attributes we want to apply to the object we are about to create
spec:
  # We can create many containers in a single pod
  containers:
    # Make a container with a name of 'posts'
    - name: posts
      # The exact image we want to use
      image: pcsmomo/posts:0.0.1
      imagePullPolicy: Never
```

`image: pcsmomo/posts` or `image: pcsmomo/posts:latest` \
if we don't specify the tag, it will try to reach docker hub to find the image:latest \
and in our case, we will get an error as we didn't push our image to docker hub

### 71. Common Kubectl Commands

|             Docker World             |              K8s World              |
| :----------------------------------: | :---------------------------------: |
|              docker ps               |          kubectl get pods           |
| docker exec -it [container_id] [cmd] |  kubectl exec -it [pod_name] [cmd]  |
|      docker logs [container_id]      |       kubectl logs [pod_name]       |
|                                      |    kubectl delete pod [pod_name]    |
|                                      | kubectl apply -f [config_file_name] |
|                                      |   kubectl describe pod [pod_name]   |

```sh
kubectl exec -it posts sh
ls
# if we run more than two containers in a pod, we need to specify which container we want to execute
kubectl logs posts
```

### 73. Introducing Deployments

When we run 3 posts pods,

1. if one Pod is down, deployment manages to keep 3 pods runnning.
2. when new version is deployed, deployment running 3 new version pods first and then kill 3 old version pods

### 74. Creating a Deployment

```sh
kubectl apply -f posts-depl.yaml
```

```sh
kubectl get deployments
kubectl describe deployment [depl_name]
kubectl apply -f [config_file_name]
kubectl delete deployment [depl_name]
```

### 75. Common Commands Around Deployments

```sh
kubectl get deployments
# NAME         READY   UP-TO-DATE   AVAILABLE   AGE
# posts-depl   1/1     1            1           7s
kubectl get pods
# NAME                          READY   STATUS    RESTARTS   AGE
# posts-depl-7b58d6bb87-kx65s   1/1     Running   0          53s
kubectl delete pod posts-depl-7b58d6bb87-kx65s
# the pod will be delete but deployment creates a new pod immediately
kubectl describe deployment posts-depl
```

### 76. Updating Deployments

Updating the image used by a deployment

1. Method #1 - using local
   1. 'blog/posts': update index.js code
   2. 'blog/posts': rebuild: `docker build -t pcsmomo/posts:0.0.2 .`
   3. 'blog/infra/k8s': update `posts-depl.yaml` file
   4. 'blog/infra/k8s':apply `kubectl apply -f posts-depl.yaml `

> Howover, this method is not really useful because we need to manually change the tag version on the yaml file

### 77. Preferred Method for Updating Deployments

2. \*Method #2 - using docker hub
   1. 'blog/infra/k8s': using 'latest' or remove tag in the pod spec section
   2. 'blog/posts': update index.js code
   3. 'blog/posts': rebuild: `docker build -t pcsmomo/posts:0.0.2 .`
   4. push to the docker hub `docker push pcsmomo/posts`
   5. 'blog/infra/k8s': run the commend
      - `kubectl rollout restart deployment [depl_name]`

```sh
kubectl get deployments
kubectl rollout restart deployment posts-depl
kubectl get deployments
kubectl get pods
# NAME                          READY   STATUS        RESTARTS   AGE
# posts-depl-6989986b47-7rrf9   1/1     Running       0          17s
# posts-depl-76c9d74774-sp788   0/1     Terminating   0          6m47s
kubectl logs posts-depl-6989986b47-7rrf9
```

### 78. Networking With Services

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

### 79. Creating a NodePort Service

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

### 80. Accessing NodePort Services

```sh
# blog/infra/k8s
kubectl apply -f posts-srv.yaml
# service/posts-srv created
kubectl get services
# NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
# kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP          23h
# posts-srv    NodePort    10.105.88.106   <none>        4000:30551/TCP   51s
kubectl describe service posts-srv
minikube ip
# 192.168.64.2
```

- PORT(S): 4000:30551/TCP\
  - 30551: nodePort randomly assigned

We can connect

- Docker for Mac/Windows - localhost:3xxxx/posts
- Docker Toolbox with Minikube - 192.168.64.2:30551/posts

### 81. Setting Up Cluster IP Services

- Posts Pod -> Cluster IP service for Event Bus -> Event Bus Pod
- Event Bus Pod -> Cluster IP service for Posts -> Posts Pod

### 82. Building a Deployment for the Event Bus

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
# event-bus-depl-668857b468-qk5vd   1/1     Running   0          24s
# posts-depl-6989986b47-7rrf9       1/1     Running   1          9h
```

### 83. Adding ClusterIP Services

```sh
kubectl apply -f event-bus-depl.yaml
# deployment.apps/event-bus-depl unchanged
# service/event-bus-srv created
kubectl apply -f posts-depl.yaml
# deployment.apps/posts-depl unchanged
# service/posts-clusterip-srv created
kubectl get pods
# NAME                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
# event-bus-srv         ClusterIP   10.99.99.77     <none>        4005/TCP         3m23s
# kubernetes            ClusterIP   10.96.0.1       <none>        443/TCP          23h
# posts-clusterip-srv   ClusterIP   10.96.25.216    <none>        4000/TCP         9s
# posts-srv             NodePort    10.105.88.106   <none>        4000:30551/TCP   37m
```

### 85. Updating Service Addresses

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
# NAME                             READY   STATUS    RESTARTS   AGE
# event-bus-depl-f7bf7b948-x5nkz   1/1     Running   0          24s
# posts-depl-94d556dcd-xk5t6       1/1     Running   0          47s
```

### 86. Verifying Communication

```sh
kubectl exec -it posts-depl-94d556dcd-bqrdf sh
cat index.js
# the address is not changed

# rebuild and push and rollout restart
docker build -t pcsmomo/posts .
docker push pcsmomo/posts
kubectl rollout restart deployment posts-depl
# somehow rollout does not work

kubectl delete deployment post-depl
kubectl apply -f posts-depl.yaml
```

### 87. Adding Query, Moderation and Comments

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
kubectl get pods
kubectl get services
```

### 88. Testing Communication

```sh
# blog/event-bus
docker build -t pcsmomo/event-bus .
docker push pcsmomo/event-bus
# blog/infra/k8s
kubectl rollout restart deployment event-bus-depl
kubectl get pods
# NAME                               READY   STATUS    RESTARTS   AGE
# comments-depl-76b7f795-gkjdc       1/1     Running   0          5m47s
# event-bus-depl-779b56dfd9-p6l8z    1/1     Running   0          2m10s
# moderation-depl-66dddc44d5-9xnzc   1/1     Running   0          5m46s
# posts-depl-5494775c9b-7z2h9        1/1     Running   1          13h
# query-depl-59b5f86c4f-m6d9n        1/1     Running   0          5m46s
```

And postman test!

- post message to http://192.168.64.2:30551/posts
- `kubectl logs comments-depl-76b7f795-gkjdc`

### 89. Load Balancer Services

React App need to communicate with all services (except moderation)

1. Option #1 - Probably not good
   - React App -> Node Port for each service
2. \*Option #2 - Probably good
   - React App -> Load Balancer Service -> Cluster IP for each service

### 90. Load Balancers and Ingress

- Load Balancer Service
  - Tell Kubernetes to reach out to its provider and provision a load balancer
  - Gets traffic in to a single pod
  - Load Balancer is actually in a cloud provider
- Ingress or Ingress Controller
  - A pod with a set of routing rules to distribute traffic to other services

React App -> Load Balancer -> Ingress Controller -> Pod

### 91. Update on Ingress Nginx Mandatory Commands

In the upcoming lecture, we will be installing Ingress Nginx. In the video, it is shown that there is a required mandatory command that needed to be run for all providers. This has since been removed, so, the provider-specific commands (Docker Desktop, Minikube, etc) are all that is required.

https://kubernetes.github.io/ingress-nginx/deploy/#environment-specific-instructions

### 92. Installing Ingress-Nginx

ingress-nginx

- [ingress-nginx Github](https://github.com/kubernetes/ingress-nginx)
- [ingress-nginx Doc](https://kubernetes.github.io/ingress-nginx/deploy)

> Note, not 'kubernetes-ingress'

```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.0/deploy/static/provider/cloud/deploy.yaml

# Environment-specific instructions¶
minikube addons enable ingress
    # ▪ Using image docker.io/jettech/kube-webhook-certgen:v1.5.1
    # ▪ Using image docker.io/jettech/kube-webhook-certgen:v1.5.1
    # ▪ Using image k8s.gcr.io/ingress-nginx/controller:v0.44.0
```

</details>
