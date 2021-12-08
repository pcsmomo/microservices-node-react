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

</details>
