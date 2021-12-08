# Details

<details open> 
  <summary>Click to Contract/Expend</summary>

## Section 24 - [Appendix A] - Basics of Docker

### 520. What is Docker?

- Docker Client (Docker CLI): Tool that we are going to issue commands to
- Docker Server (Docker Deamon): Tool that is responsible for creating images, running, containers, etc
- Docker Machine
- Docker Image
- Docker Container
- Docker Hub
- Docker Compose

### 528. Using the Docker Client

```sh
docker version
docker run hello-world
```

### 529. But Really... What's a Container?

- Kernel: opens endpoints to allocate hardware resources such as HD, memory and network
- Namespacing: Isolating resources per process (or group of processes)
- Control Groups(cgroups): Limit amount of resources used per process

namespacing and cgroups belong to linux system

### 530. How's Docker Running on Your Computer?

Docker Server is based on linux virtual machine\
So it would have several containers and they communicate via Linux Kernel

### 531. Docker Run in Detail

```sh
docker run hello-world
```

### 532. Overriding Default Commands

```sh
docker run busybox echo hi there
docker run busybox ls
docker run busybox ls bin
```

why `busybox`, not `hello-world`?\
-> hello-world doesn't contain all of them, but only one single file for hello-world

</details>
