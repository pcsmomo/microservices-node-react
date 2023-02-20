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

</details>
