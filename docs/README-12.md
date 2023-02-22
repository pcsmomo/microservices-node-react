# Details

<details open> 
  <summary>Click to Contract/Expend</summary>

# How to run

```sh
minikube tunnel

# ./ticketing/client
docker build -t YOURDOCKERID/client .
# docker push YOURDOCKERID/client # necessary?

# ./ticketing
skaffold dev

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
```

add `127.0.0.1 ticketing.dev` to /etc/hosts

## Section 12 - Code Sharing and Reuse Between Services

### 256. Options for Code Sharing

1. Code Sharing Option #1 - Direct Copy Paste
2. Code Sharing Option #2 - Git Submodule
3. Code Sharing Option #3 - NPM Package

### 257. NPM Organizations

- NPM Public Registry
  - Organization
- NPM Private Registry

### Create a new organization on npmjs.com

- https://www.npmjs.com/org/create
- Create a new organization
  - dwktickets

### 258. Publishing NPM Modules

```sh
# ./ticketing
mkdir common
cd common
npm init -y
```

I will have to create the pakcage outside of this git repo\
as it should have it's own git set up

```sh
# udemy/microservices-node-react/dwktickets-npm/commmon
git init
git add .
git commit -m"initial commit"

npm login
npm publich --access public
```

</details>
