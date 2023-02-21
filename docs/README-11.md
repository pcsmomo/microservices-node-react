# Details

<details open> 
  <summary>Click to Contract/Expend</summary>

# How to run

```sh
# ticketing
minikube tunnel
skaffold dev

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
```

add `127.0.0.1 ticketing.dev` to /etc/hosts

## Section 11 - Integrating a Server-Side-Rendered React App

### 219. Basics of Next JS

```sh
# ticketing
mkdir client
cd client
npm init -y
npm install --save react react-dom next
```

### 220. Building a Next Image

> We will be writing the Next app using Javascript, not Typescript\
> It would be normally be beneficial to use TS, but this app in particular would need a lot of extra TS stuff written out for little benefit

```sh
docker build -t pcsmomo/client .
```

### 221. Running Next in Kubernetes

1. create `client-depl.yaml`
2. add artifact to `skaffold.yaml`
3. add path to `ingress.srv.yaml`
   - path will be captured in order.
   - client should be to the bottom as the other services has more specific paths

```sh
# restart skaffold
skaffold dev
```

- Navigate https://ticketing.dev
- if get a warning message, type `thisisunsafe`

### 223. Note on File Change Detection

Next js is(or was) finicky that sometimes it doesn't hot reload the changes.

However, now I am using `"next": "^13.1.6"` which is the latest version, I have not observed my changes are not reflected.

If it happenes,

- firstly, create `next.config.js`
  ```js
  // ticketing/client/next.config.js
  module.exports = {
    webpack: config => {
      config.watchOptions.poll = 300;
      return config;
    },
  };
  ```
- secondly, manually kill the client pod, then k8s will create the new pod with the changes applied
  ```sh
  # manually kill the pod
  kubectl delete pod client-depl-7fdb5dc774-tqn4d
  ```

### 224. Adding Global CSS

```sh
# ticketing/client
npm install bootstrap
```

### 226. Handling Email and Password Inputs

```sh
npm install axios
```

### 232. Overview on Server Side Rendering

- NextJs
  - inspect URL of incoming request. Datetime set of components to show
  - Call those components `getInitialProps` static method
  - Render each component with data from `getInitialProps` one time
  - Assemble HTML from all components, send back response

### 235. Why the Error?

Server Error

Error: connect ECONNREFUSED 127.0.0.1:80

- when axios request(`/api/users/currentuser`) happens from client side, the browser takes use the same domain (https://ticketing.dev/api/users/currentuser)
  - and ingress Nginx will take care of it
- but axios request(`/api/users/currentuser`) happens in `getInitialProps` which is node server running on the pod 127.0.0.1:80,
  - it tries to connect `127.0.0.1:80/(api/users/currentuser`
  - because we run this whole microservices in kubernetes

### 236. Two Possible Solutions

- \*Request Option #1:
  - follow the same domain we're currently on
  - http://????/api/users/currentuser
- Request Option #2:
  - http://auth-srv/api/users/currentuser
  - cons
    - NextJs will be quite coupled to the specific service
    - moreover, we've already defined all these in `ingress-srv.yaml`

#### challenges for us

1. Routing
2. Cookie

### 237. Cross Namespace Service Communication

We access ervices using that `http://auth-srv` style only when they are in the same namespace

```sh
k get ns
# NAME                   STATUS   AGE
# default                Active   14d
# ingress-nginx          Active   11d
# kube-node-lease        Active   14d
# kube-public            Active   14d
# kube-system            Active   14d
# kubernetes-dashboard   Active   14d
```

#### Cross namespace communication uses a different pattern

http://NAMEOFSERVICE.NAMESPACE.svc.cluster.local

```sh
k get services -n ingress-nginx
# NAME                                 TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
# ingress-nginx-controller             NodePort    10.97.172.57    <none>        80:31503/TCP,443:31729/TCP   11d
# ingress-nginx-controller-admission   ClusterIP   10.99.249.113   <none>        443/TCP                      11d
```

- http://ingress-nginx.ingress-nginx-controller.svc.cluster.local
- http://ingress-nginx.ingress-nginx-controller.svc.cluster.local/api/users/currentuser

> However, this domain is not easy to remember and use it \
> (Optional) then we can use `External Name Service` to use it like this short form, http://ingress-nginx \
> We won't do this in this course

### 238. When is GetInitialProps Called?

- getInitialProps executed on the server
  - hard refresh of page
  - clicking link from different domain
  - typing url into address bar
- getInitialProps executed on the client
  - navigating from one page to another while in the app
    - test in `https://ticketing-dev/auth/signup`

</details>
