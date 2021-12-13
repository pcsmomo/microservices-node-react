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

</details>
