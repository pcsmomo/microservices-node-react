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

If I run two containers and I create a new file on one, basically they don't share file system.

</details>
