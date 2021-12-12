# microservices-node-react

Microservices with Node JS and React by Stephen Grider

## Folder structure

- 02-mini-microservices-app
  - blog
    - client: create-react-app
    - posts
    - comments
    - event-bus
- 03-with-docker
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

</details>
