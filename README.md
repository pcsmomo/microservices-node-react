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
  - blog
    - infra
      - k8s: kubernetes
- 05-architecture-multi-service-app
  - ticketing/auth
- 06-cloud
  - exactly the same code as the previous section
- 07-response-normalization: code from section 05
  - ticketing/auth
    - Error message handling middleware
    - express swagger setup
    - express-async-errors
- 08-database-modeling
  - ticketing/auth
    - mongoose
- 09-authentication
  - ticketing/auth
    - jwt
    - K8s Secret
- 10-testing
  - ticketing/auth
- 11-SSR-nextjs
  - ticketing/client
- 12-code-sharing-reuse
  - ticketing/auth
  - ticketing/common
- 13-tickets-crud-server
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

- [README-Section 1 to 3: microservices with docker](./docs/README-01.md)
- [README-Section 4: microservices kubernetes](./docs/README-04.md)
- [README-Section 4 - on Mac pro m1](./docs/README-04-m1.md)
- [README-Section 5: ticketing app with skaffold](./docs/README-05.md)
- [README-Section 6: Cloud Setup](./docs/README-06.md)
- [README-Section 7 to 10](./docs/README-07.md)
- [README-Section 11: Server Side Rendered React app (Next js)](./docs/README-11.md)
- [README-Section 12 to 13](./docs/README-12.md)
- [README-Section 14: NATS Streaming Server](./docs/README-14.md)
- [README-Appendix-Docker](./docs/README-appx-docker.md)

<details open> 
  <summary>Click to Contract/Expend</summary>

</details>
