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

### 538. Stopping Containers

```sh
docker create busybox ping google.com
# 0547fcddf48255831fc4695fba2c49426237b229746edb94fb4c7620ef186bcf
docker start 0547fcddf48255831fc4695fba2c49426237b229746edb94fb4c7620ef186bcf
docker logs 0547fcddf48255831fc4695fba2c49426237b229746edb94fb4c7620ef186bcf
docker ps
```

- Stop a Container: `docker stop <container id>`
  - stop -> `SIGTERM` -> give a little bit of time to shut it down and clean up
  - The SIGTERM signal is a generic signal used to cause program termination. Unlike SIGKILL, this signal can be blocked, handled, and ignored. It is the normal way to politely ask a program to terminate.
  - with `docker stop` command, if the container is not automatically stopped _in 10 seconds_, `docker kill` will be executed.
- Kill a Container: `docker kill <container id>`
  - kill -> `SIGKILL` -> shutdown immediately
  - The SIGKILL signal is used to cause immediate program termination. It cannot be handled or ignored, and is therefore always fatal. It is also not possible to block this signal.

[Termination Signals (The GNU C Library)](https://www.gnu.org/software/libc/manual/html_node/Termination-Signals.html)

```sh
docker stop 0547fcddf482
# ping command doesn't really react to stop(SIGTERM) command
# so kill will be executed
docker start 0547fcddf482
docker kill 0547fcddf482
```

### 539. Multi-Command Containers

```sh
# already installed redis via brew
redis-server
redis-cli
set mynumber 5
get mynumber
# 5
```

```sh
docker run redis
```

### 540. Executing Commands in Running Containers

```sh
docker exec -it <container id> <command>
docker run redis
docker ps
docker exec -it 73b7e60d4626 redis-cli
# [127.0.0.1:6379>
```

### 541. The Purpose of the 'it' Flag

- STDIN
- STDOUT
- STDERR

```sh
-i, --interactive          Keep STDIN open even if not attached
    --privileged           Give extended privileges to the command
-t, --tty                  Allocate a pseudo-TTY
docker exec -i 73b7e60d4626 redis-cli
# it's attached but it doens't have pretty/helping terminal support
```

### 542. Getting a Command Prompt in a Container

```sh
docker exec -it 73b7e60d4626 sh
cd /
ls
# bin  boot  data  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
echo hi there
# hi there
export b=5
echo $b
redis-cli
# [127.0.0.1:6379>
Ctrl + D (to exit)
```

- bash
- powershell
- zsh
- sh

> Traditionally most containers have `sh` included, but some have `bash`

### 543. Starting with a Shell

```
docker run -it busybox sh
ping google.com
```

### 544. Container Isolation

```sh
docker run -it busybox sh
# In a new tab
docker run -it busybox sh
touch hithere
ls
```

> If I run two containers and I create a new file on one, basically they don't share file system.

### 546. Buildkit for Docker Desktop v2.4.0+ and Edge

- [Build images with BuildKit](https://docs.docker.com/develop/develop-images/build_enhancements/)
- [Specifying external cache sources](https://docs.docker.com/engine/reference/commandline/build/#specifying-external-cache-sources)
- [Advanced Dockerfiles: Faster Builds and Smaller Images Using BuildKit and Multistage Builds](https://www.docker.com/blog/advanced-dockerfiles-faster-builds-and-smaller-images-using-buildkit-and-multistage-builds/)

### 547. Building a Dockerfile

```sh
# 24-docker/01-redis-image
docker build .
docker run 62d17fb20f2136049f12adbefc57552b347a96849cd918d4e7b78ec9bfcca00d
```

### 548. Dockerfile Teardown

```sh
# Use an existing docker image as a base
FROM alpine

# Download and install a dependency
RUN apk add --update redis

# Tell the image what to do when it starts as a container
CMD ["redis-server"]
```

- alpine: A minimal Docker image based on Alpine Linux with a complete package index and only 5 MB in size
- apk: Alpine Linux package manager

### 550. The Build Process in Detail

1. `docker build .`: give me docker image out of docker cli

the build result between option `"buildkit": true` and `"buildkit": false` are different.

```sh
# "buildkit": true
noah@Noahs-MacBook-Pro 01-redis-image % docker build .
[+] Building 13.2s (7/7) FINISHED
 => [internal] load build definition from Dockerfile                                                                            0.1s
 => => transferring dockerfile: 240B                                                                                            0.0s
 => [internal] load .dockerignore                                                                                               0.0s
 => => transferring context: 2B                                                                                                 0.0s
 => [internal] load metadata for docker.io/library/alpine:latest                                                                7.4s
 => [auth] library/alpine:pull token for registry-1.docker.io                                                                   0.0s
 => [1/2] FROM docker.io/library/alpine@sha256:21a3deaa0d32a8057914f36584b5288d2e5ecc984380bc0118285c70fa8c9300                 1.2s
 => => resolve docker.io/library/alpine@sha256:21a3deaa0d32a8057914f36584b5288d2e5ecc984380bc0118285c70fa8c9300                 0.0s
 => => sha256:59bf1c3509f33515622619af21ed55bbe26d24913cedbca106468a5fb37a50c3 2.82MB / 2.82MB                                  0.8s
 => => sha256:21a3deaa0d32a8057914f36584b5288d2e5ecc984380bc0118285c70fa8c9300 1.64kB / 1.64kB                                  0.0s
 => => sha256:e7d88de73db3d3fd9b2d63aa7f447a10fd0220b7cbf39803c803f2af9ba256b3 528B / 528B                                      0.0s
 => => sha256:c059bfaa849c4d8e4aecaeb3a10c2d9b3d85f5165c66ad3a4d937758128c4d18 1.47kB / 1.47kB                                  0.0s
 => => extracting sha256:59bf1c3509f33515622619af21ed55bbe26d24913cedbca106468a5fb37a50c3                                       0.3s
 => [2/2] RUN apk add --update redis                                                                                            3.7s
 => exporting to image                                                                                                          0.5s
 => => exporting layers                                                                                                         0.5s
 => => writing image sha256:62d17fb20f2136049f12adbefc57552b347a96849cd918d4e7b78ec9bfcca00d                                    0.0s
```

```sh
# "buildkit": false
noah@Noahs-MacBook-Pro 01-redis-image % docker build .
Sending build context to Docker daemon  2.048kB
Step 1/3 : FROM alpine
latest: Pulling from library/alpine
59bf1c3509f3: Already exists
Digest: sha256:21a3deaa0d32a8057914f36584b5288d2e5ecc984380bc0118285c70fa8c9300
Status: Downloaded newer image for alpine:latest
 ---> c059bfaa849c
Step 2/3 : RUN apk add --update redis
 ---> Running in 041ffef007ff
fetch https://dl-cdn.alpinelinux.org/alpine/v3.15/main/x86_64/APKINDEX.tar.gz
fetch https://dl-cdn.alpinelinux.org/alpine/v3.15/community/x86_64/APKINDEX.tar.gz
(1/1) Installing redis (6.2.6-r0)
Executing redis-6.2.6-r0.pre-install
Executing redis-6.2.6-r0.post-install
Executing busybox-1.34.1-r3.trigger
OK: 8 MiB in 15 packages
Removing intermediate container 041ffef007ff
 ---> 505677ae7f28
Step 3/3 : CMD ["redis-server"]
 ---> Running in 59d6409a9a32
Removing intermediate container 59d6409a9a32
 ---> bc5303779113
Successfully built bc5303779113
```

- Each step except step 1, follows this process
  1. Create a new temporary container based on an image from the previous step
  2. Execute command
  3. Remove the temporary container
  4. Create a new image based on the result

### 552. Rebuilds with Cache

```
RUN apk add --update gcc
```

```sh
noah@Noahs-MacBook-Pro 01-redis-image % docker build .
Sending build context to Docker daemon  2.048kB
Step 1/4 : FROM alpine
 ---> c059bfaa849c
Step 2/4 : RUN apk add --update redis
 ---> Using cache
 ---> 505677ae7f28
Step 3/4 : RUN apk add --update gcc
 ---> Running in 4063e9253202
fetch https://dl-cdn.alpinelinux.org/alpine/v3.15/main/x86_64/APKINDEX.tar.gz
fetch https://dl-cdn.alpinelinux.org/alpine/v3.15/community/x86_64/APKINDEX.tar.gz
(1/11) Installing libgcc (10.3.1_git20211027-r0)
(2/11) Installing libstdc++ (10.3.1_git20211027-r0)
(3/11) Installing binutils (2.37-r3)
(4/11) Installing libgomp (10.3.1_git20211027-r0)
(5/11) Installing libatomic (10.3.1_git20211027-r0)
(6/11) Installing libgphobos (10.3.1_git20211027-r0)
(7/11) Installing gmp (6.2.1-r0)
(8/11) Installing isl22 (0.22-r0)
(9/11) Installing mpfr4 (4.1.0-r0)
(10/11) Installing mpc1 (1.2.1-r0)
(11/11) Installing gcc (10.3.1_git20211027-r0)
Executing busybox-1.34.1-r3.trigger
OK: 118 MiB in 26 packages
Removing intermediate container 4063e9253202
 ---> 83fc43ba34a6
Step 4/4 : CMD ["redis-server"]
 ---> Running in e36ad7baea5f
Removing intermediate container e36ad7baea5f
 ---> 44f7d19aff95
Successfully built 44f7d19aff95
```

```
RUN apk add --update redis
RUN apk add --update gcc
⬇️
RUN apk add --update gcc
RUN apk add --update redis
```

> if the series of order changes, we cannot use cache and it will build all again

### 553. Tagging an Image

`docker build -t pcsmomo/redis:latest .`

- `pcsmomo/redis:latest`
  - pcsmomo: my docker id
  - redis: repo/project name
  - latest: version

```sh
docker build -t pcsmomo/redis:latest .
docker run pcsmomo/redis
```

### 555. Manual Image Generation with Docker Commit

Just for Practice Manual Image generation

```sh
docker run -it alpine sh
apk add --update redis
# new tab
docker ps
# | CONTAINER ID |  IMAGE  |     COMMAND     |      CREATED       |          STATUS          | PORTS |     NAMES     |
# | :----------: | :-----: | :-------------: | :----------------: | :----------------------: | :---: | :-----------: |
# | 5f943d0f3d3a | alpine  |      "sh"       | About a minute ago |    Up About a minute     |       | sweet_pascal  |
docker commit -c 'CMD ["redis-server"]' 5f943d0f3d3a
# sha256:c01e6d5982bc36560e9d6e65d6cf5ca1758418e06a04eb7b343b899a4fd9d178
docker run c01e6d5982bc3
```

> we don't have to copy all the full sha256 strings. Just unique enough is fine

</details>
