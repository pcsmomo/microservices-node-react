# Details

<details open> 
  <summary>Click to Contract/Expend</summary>

# How to run

```sh
minikube tunnel

# ./ticketing/client
docker build -t pcsmomo/client .
docker push pcsmomo/client # skaffold pull the image from here

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

### 262. Relocating Shared Code

```ts
import { BadRequestError } from '@dwttickets/common/errors/bad-request-error';
✅ import { BadRequestError } from '@dwttickets/common';

// I would prefer to have option for this though
import { BadRequestError } from '@dwttickets/common/errors';
import { validateRequest } from '@dwttickets/common/middlewares';
```

```sh
# ./ticketing/common
# udemy/microservices-node-react/dwktickets-npm/commmon
npm install express express-validator cookie-session jsonwebtoken @types/express @types/cookie-session @types/jsonwebtoken
```

```sh
# udemy/microservices-node-react/dwktickets-npm/commmon
npm run pub
```

### 263. Updating Import Statements

```sh
# ./ticketing/auth
npm install @dwktickets/common
# "@dwktickets/common": "^1.0.3",
```

### 264. Updating the Common Module

```sh
# udemy/microservices-node-react/dwktickets-npm/commmon
npm run pub
# + @dwktickets/common@1.0.4
```

```sh
# ./ticketing/auth
npm update @dwktickets/common
# "@dwktickets/common": "^1.0.4",
```

```sh
k get pods
k exec -it auth-depl-dbccd4b4-g5sdx sh
> cat node_modules/@dwktickets/common/package.json
# "version": "1.0.3",
# Hmm...

# even after `skaffold build`, it is still 1.0.3 version.
# I had to update the library manually in the pod
k exec -it auth-depl-dbccd4b4-g5sdx sh
> npm update @dwktickets/common
```

## Section 13 - Create-Read-Update-Destroy Server Setup

### 267. Project Setup

```sh
# ./ticketing
mkdir tickets
cd tickets

npm install
```

```sh
docker build -t pcsmomo/tickets .
docker push pcsmomo/tickets # skaffold pull the image from here
```

### 273. Adding Auth Protection

Two ways to assert the tests with supertest response

```ts
// 1
const response = await request(app).post('/api/tickets').send({});
expect(response.status).not.toEqual(404);

// 2
await request(app).post('/api/tickets').send({}).expect(401);
```

### 274. Faking Authentication During Tests

1. Singup on https://ticketing.dev
2. Copy the cookie value after `session=` on the network tab
3. Decode it on https://www.base64decode.org/
4. Copy the JWT value

### 284. What's that Error?!

> In the lecture, an error was expected for the mongodb document id\
> I don't get any error. Maybe latest mongoose changes not to throw the error.

### 285. Better Error Logging

After fix

```sh
# udemy/microservices-node-react/dwktickets-npm/commmon
npm run pub
# v1.0.5

# ./ticketing/tickets
npm update @dwktickets/common
```

### 288. Handling Updates

Generate mongoose random object id

````ts
import mongoose from 'mongoose';
const id = new mongoose.Types.ObjectId().toHexString()
```

</details>
````
