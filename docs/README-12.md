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

### 259. Project Setup

- There might be differences in our TS settings between the common lib and our services - don't want to deal with that
- Services might not be written with TS at all!
- **Our common library will be written as Typescript and published as Javascript**

```sh
# ./ticketing/common
# udemy/microservices-node-react/dwktickets-npm/commmon
tsc --init
npm install typescript del-cli --save-dev
```

```json
{
  "declaration": true /* Generate .d.ts files from TypeScript and JavaScript files in your project. */,
  "outDir": "./build" /* Specify an output folder for all emitted files. */
}
```

```sh
# ./ticketing/common
npm run build
```

### 261. An Easy Publish Command

```sh
# ./ticketing/common

```

```sh
# udemy/microservices-node-react/dwktickets-npm/commmon
git add .
git commit -m "additional config"

npm version patch
# v1.0.1

npm run build
# > npm run clean && tsc
# > @dwktickets/common@1.0.1 clean
# > del ./build/*

npm publish
# npm notice
# npm notice 📦  @dwktickets/common@1.0.1
# npm notice === Tarball Contents ===
# npm notice 396B package.json
# npm notice === Tarball Details ===
# npm notice name:          @dwktickets/common
# npm notice version:       1.0.1
# npm notice filename:      @dwktickets/common-1.0.1.tgz
# npm notice package size:  316 B
# npm notice unpacked size: 396 B
# npm notice shasum:        59cf2c1ee64285d460c1907a7a9ab2feff6cd80e
# npm notice integrity:     sha512-Hkv6mrJy/N88v[...]2giVzckr47flA==
# npm notice total files:   1
# npm notice
# npm notice Publishing to https://registry.npmjs.org/
# + @dwktickets/common@1.0.1
```

> 'pub' script is not a suggested way to do \
> becuase set it the same commit message and always patch the version
> In this course, we use it for saving time.

```json
{
  "scripts": {
    "pub": "git add . && git commit -m \"Updates\" && npm version patch && npm run build && npm publish"
  }
}
```

</details>
