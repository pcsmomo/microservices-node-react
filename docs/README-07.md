# Details

<details open> 
  <summary>Click to Contract/Expend</summary>

## Section 7 - Response Normalization Strategies

```sh
# ticketing
minikube tunnel
skaffold dev
```

### 134. Adding Validation

```sh
npm install --save express-validator
```

### set up swagger on express

```sh
npm install --save express
npm install --save swagger-ui-express swagger-jsdoc
npm install --save-dev @types/swagger-ui-express @types/swagger-jsdoc
```

### 135. Handling Validation Errors

Check the validation using postman, https://tickets.dev/api/users/signup

### 136. Postman HTTPS Issues

Turn off the postman `SSL certificate verification option` in Settings

### 137. Surprising Complexity Around Errors

If services in different language (node, python, java, etc.) and using different libraries \
would send different structure of error messages

This has been an issue at my work.

The solution in this lecture is to have consistent structure from the backends

Then React App doesn't need to handle those different structures of error messages!

### 139. Solution for Error Handling

- Write an error handling middleware
- Make sure w ecapture all possible erros using Express's error handling mechanism (call the `next` function!)

[Express Error Handling](https://expressjs.com/en/guide/error-handling.html)

1. Synchronous erorr handler
2. Asynchronous route handler

#### E.G. Writing error handlers

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

</details>