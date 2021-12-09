# microservices-node-react

Microservices with Node JS and React by Stephen Grider

## Folder structure

- 24-folder
  - 01-redis-image: start from lecture "547. Building a Dockerfile"

# Details

[README-Appendix-Docker](./README-appx-docker.md)

<details open> 
  <summary>Click to Contract/Expend</summary>

### 4. What Is a Microservice?

- Monolithic server contains
  - Routhing, Middlewares, Business Logic, Database Access
  - to implement **all featrues** of our app
- A single microservice contains
  - Routhing, Middlewares, Business Logic, Database Access
  - to implement **one feature** of our app

### 5. Data in Microservices

- Database-Per-Service Pattern
  - Each service will have its own data (if it needs)

### 6. Big Problems with Data

Data management between services

> This is the big problem of microservices, and what 90% of this course focuses on

### 7. Sync Communication Between Services

- Sync: Services communicate with each other using direct requests
- Async: Services communicate with each other using _events_

> These words don't mean what they mean in the Javascript world!!!!

- Sync - Pros
  - Conceptually easy to understand
  - Service D won't need a database
- Sync - Cons
  - Introduces a dependency between services
  - If any inter-service request fails, the overall request fails
  - The entire request is only as fast as the slowest request
  - Can easily introduce webs of requests

### 8. Event-Based Communication

- Async method #1: works the same as `Sync` but via Event Bus
  - So, the Pros and Cons are the same as `Sync` way.

### 10. Pros and Cons of Async Communication

Just like the database-per-service pattern, async communication is going to seem bizarre and inefficient

- Pros
  - Service D has zaro dependencies on other services.
  - Service D will be extremely fast.
- Cons
  - Data duplication (but it won't cost too much)
  - Harder to understand

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

</details>
