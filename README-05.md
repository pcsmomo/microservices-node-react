# Details

<details open> 
  <summary>Click to Contract/Expend</summary>

## Section 5 - Architecture of Multi-Service Apps

### 105. Big Ticket Items

Painful Things from App #1 (blog)

1. Lots of duplicated code
   - Build a central library as an NPM module to share code between our different projects
2. Really hard to picture the flow of events between services
   - Precisely define all our events in this shared library
3. Really hard to remember what properties an event should have
   - Write everything in Typescript
4. Really hard to test some event flows
   - Write tests for as much as possible/reasonable
5. My machine is getting laggy running kubernetes and everything else...
   - Run a k8s cluster in the cloud and develop on it almost as quickly as local
6. What if someone created a comment after editing 5 others after editing a post while balancing on a tight rope...
   - Introduce a lot of code to handle concurrency issues

</details>
