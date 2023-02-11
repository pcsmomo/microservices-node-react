# Details

<details open> 
  <summary>Click to Contract/Expend</summary>

## Section 4 - Orchestrating Collections of Services with Kubernetes

### 63. Installing Kubernetes

Click Docker Icon on the tray -> Preferences -> Kubernetes -> Enable Kubernetes

> However, I'm enabling kubernetes from docker desktop\
> (it take too long to enable/disable for me)\
> running command `minikube start --driver=docker`

### 64. IMPORTANT Note for Minikube and MicroK8s Users

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

### 65. A Kubernetes Tour

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

### 66. Important Kubernetes Terminology

- Kubernetes Cluster : A collections of nodes + a master to manage them
- Node: A Virtual machine that will run our containers
- Pod: More or less a running container. Technically, a pod can run multiple containers (we won't do this)
- Deployment: Monitors a set of pods, make sure they are running and restarts them if they crash
- Service: Provides **an easy-to-remember URL** to access a running container

</details>
