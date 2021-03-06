# Details

<details open> 
  <summary>Click to Contract/Expend</summary>

## Section 1 - Fundamental Ideas Around Microservices

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

## Section 2 - A Mini-Microservices App

### 13. Project Setup

```sh
mkdir blog
cd blog
npx create-react-app client
# ./blog/
mkdir posts
cd posts
npm init -y
npm install --save express cors axios nodemon
# ./blog/
mkdir comments
cd comments
npm init -y
npm install --save express cors axios nodemon
```

### 14. Posts Service Creation

```js
// blog/posts/index.js
// generate simple id
const { randomBytes } = require('crypto');
const id = randomBytes(4).toString('hex');
```

### 15. Testing the Posts Service

- Postman POST test
  - POST / localhost:4000/posts
  - Headers: Content-Type: application/json
  - Body: raw / JSON
    - `{ "title": "First Post" }`
- Postman GET test
  - GET / localhost:4000/posts
  - Headers: Content-Type: application/json

### 20. React Project Setup

```sh
# blog/client
npm install --save axios
```

```json
// settings.json
// Enabling to use emmet in JSX
{
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

### 27. Request Minimization Strategies

> The problem so far, is that the front server is requesting too many http requests\
> to get posts and comments

It would not be a problem with a monoliths service!

How to solve it with microservices?

1. Solution #1 - Sync communication
   - when get posts - take the whole bunch of data including comments
2. Solution #2 - Async communication
   - using _Event Broker_ (Event bus?)
   - and using a new service: Query service

### 28. An Async Solution

- Pros
  - Query Service has zaro dependencies on other services.
  - Query Service will be extremely fast.
- Cons
  - Data duplication (but it won't cost too much)
  - Harder to understand

### 30. Event Bus Overview

- Many different implementations.
  - RabbitMQ
  - Kafka
  - MATS
  - ZeroMQ
- Receives events, publishes them to listeners
- Many different subtle features that make async communication way easier or way harder
- We are going to build our own event bus using Express. It will not implement the vast majority of features a normal bus has
- Yes, for our next app we will use a production grade, open source event bus

### 30. Event Bus Overview

```sh
# /blog
mkdir event-bus
cd event-bus
npm init -y
npm install --save express axios nodemon
```

### 36. Creating the Data Query Service

```sh
# /blog
mkdir query
cd query
npm init -y
npm install --save express cors nodemon
```

### 38. Using the Query Service

> Now, if post server or comment server is down\
> we still get all data from query server

### 40. Issues with Comment Filtering

Adding a new feature : Moderation service (if it contains 'Orange')

- status : pending | approved | rejected

1. Option #1 - Moderation communicates event creation to query service
   - Chain. Comment -> Event bus -> Moderation -> Event bus -> Query Service -> GUI
   - What if the Moderation Service takes very long time to process?

### 41. A Second Approach

2. Option #2 - Moderation updates at both comments and query services
   - Query service instantly create { status: 'pending' } while moderation is processing

But what if the comment has various options including complex business logic

- type: CommentModerated - comment.status = 'approved'
- type: CommentUpvoted - comment.votes += 1
- type: CommentDownvoted - comment.votes -= 1
- type: CommentPromoted - comment.promoted = true
- type: CommentAnonymized - comment.userId = null
- type: CommentSearchable - comment.searchable = true
- type: CommentAdvertised - comment.advertised = true

and it has more Services and they have to handle these comment status above?

- Query Service
- Weekly Update Service
- Recommendation Service

### 42. How to Handle Resource Updates

3. Option #3 - Query Service only listens for 'update' events
   - Comments Service will handle all complex logic and send 'CommentUpdated' to Query Service
   - Comment -> Event bus -> Moderation -> Event bus -> Comment -> Event bus -> Query Service -> GUI
   - Comment will have default status { status: 'pending' } so, if Moderation takes long time, it is okay

### 43. Creating the Moderation Service

```sh
# /blog
mkdir moderation
cd moderation
npm init -y
npm install --save express axios nodemon
```

### 44. Adding Comment Moderation to 48. A Quick Test

1. Comment Service - send { type: 'CommentCreated' }, { status: 'pending' }
2. Query Service - receive { type: 'CommentCreated' }, { status: 'pending' }
3. Event Bus - broadcast
4. Moderation Service - receive { type: 'CommentCreated' }, { status: 'pending' }
5. Moderation Service - send { type: 'CommentModerated' }, { status: 'rejected' | 'approved' }
6. Event Bus - broadcast
7. Comment Service - receive { type: 'CommentModerated' }
8. Comment Service - send { type: 'CommentUpdated' }
9. Event Bus - broadcast
10. Query Service - receive { type: 'CommentUpdated' }

### 49. Rendering Comments by Status

Even when moderation service is down, the system is not clashed.\
But when moderation service is up, the status is still 'pending' and it's a bit unsynched situation

### 50. Dealing with Missing Events

1. Option #1 - Sync Requests
   - Downside: should implement expected behaviour in Query, Posts and Comments
2. Option #2 - Direct DB Access
   - Downside: should implement in Query Service with interfaces for different DBs
3. \*Option #3 - Store Events
   - in Event Bus

### 53. Event Syncing in Action

```sh
# blog/query
npm install --save axios
```

> Holy moly... This is neat!

## Section 3 - Running Services with Docker

### 54. Deployment Issues

Since deploying to a cloud service,

1. Scenario #1. Comments Service is over heated, so it needs scaling up.
   - adding two more Comemnts Services
   - two more endpoints need to be handled
2. Scenario #2. If additional Comments Services are built in the second virtual machine
3. Scenario #3. When not busy time, we want to shut down additional Comments Services to save money and resource.

> Docker and Kubernetes can be good solutions!!

### 56. Why Kubernetes?

- Cluster
  - Mater: Program to manage everything in the cluster
  - Node: Virtual machine

### 59. Dockerizing the Posts Service

```sh
# blog/posts
docker build .
# => => writing image sha256:7058e1a2c1691c63ded015c9a13731d9e2690b8b70cc  0.0s
docker run 7058e1a2c1691c63ded015c9a13731d9e2690b8b70cc
```

### 60. Review Some Basic Commands

```sh
docker build -t pcsmomo/posts .
docker run [image id or image tag]
docker -it [image id or image tag] [cmd]
# docker run -it pcsmomo/posts sh
docker ps
docker exec -it [container id] [cmd]
# docker exec -it pcsmomo/posts sh
docker logs [container id]
```

### 61. Important Note Regarding Node v17

Currently, there is a critical bug in many libraries such as Webpack and Create React App caused by the release of Node v17.

- [react-scripts fails to build project with Node 17 #11562](https://github.com/facebook/create-react-app/issues/11562)
- [nodejs 17: digital envelope routines::unsupported #14532](https://github.com/webpack/webpack/issues/14532)

</details>
