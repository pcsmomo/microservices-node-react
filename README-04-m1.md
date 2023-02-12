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

</details>
