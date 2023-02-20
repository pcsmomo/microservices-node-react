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

</details>
