# Details

<details open> 
  <summary>Click to Contract/Expend</summary>

# [Appendix A] - Basics of Docker

## Section 1: Dive Into Docker!

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

## Section 2: Manipulating Containers with the Docker Client

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

### 533. Listing Running Containers : docker ps

```sh
docker ps
docker run busybox ping google.com
docker ps
docker ps --all
```

### 534. Container Lifecycle

`docker run` = `docker create` + `docker start`

```sh
docker create hello-world
# 345e9a72706489ad455541d2d2c55991d28f85b63233a847dee307fec4e3a9be
docker start -a 345e9a72706489ad455541d2d2c55991d28f85b63233a847dee307fec4e3a9be
```

### 535. Restarting Stopped Containers

```sh
docker ps -a
# | CONTAINER ID |  IMAGE  | COMMAND  |    CREATED     |          STATUS           |     PORTS      | NAMES |
# | :----------: | :-----: | :------: | :------------: | :-----------------------: | :------------: | :---: |
# | 71e182459e15 | busybox | "ls bin" | 13 minutes ago | Exited (0) 33 seconds ago | stoic_meninsky |       |
docker start -a 71e182459e15
docker start -a stoic_meninsky
```

### 536. Removing Stopped Containers

```sh
docker system prune
# WARNING! This will remove:
#   - all stopped containers
#   - all networks not used by at least one container
#   - all dangling images
#   - all dangling build cache

docker container prune
```

### 537. Retrieving Output Logs

```sh
docker create busybox echo hi there
# 5307aeeb3432e854ed7eb2a6884e4336cb71bea8be64e50076f8870beb7c5e35
docker ps -a
# | CONTAINER ID |  IMAGE  |     COMMAND     |    CREATED     | STATUS  | PORTS |     NAMES     |
# | :----------: | :-----: | :-------------: | :------------: | :-----: | :---: | :-----------: |
# | 5307aeeb3432 | busybox | "echo hi there" | 28 seconds ago | Created |       | peaceful_benz |
docker start 5307aeeb3432e854ed7eb2a6884e4336cb71bea8be64e50076f8870beb7c5e35
docker container ls -a
# | CONTAINER ID |  IMAGE  |     COMMAND     |    CREATED     |          STATUS          | PORTS |     NAMES     |
# | :----------: | :-----: | :-------------: | :------------: | :----------------------: | :---: | :-----------: |
# | 5307aeeb3432 | busybox | "echo hi there" | 53 seconds ago | Exited (0) 2 seconds ago |       | peaceful_benz |
docker logs 5307aeeb3432
# hi there
```

</details>
