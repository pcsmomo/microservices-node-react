import express, { json } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerJsDocSpecs, swaggerUiOptions } from './config/swagger-config';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();
app.use(json());

// Swagger docs
app.use(
  '/api/users/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsDocSpecs, swaggerUiOptions)
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// The port wouldn't matter when we start kubernetes
app.listen(3000, () => {
  console.log('Listening on port 3000!!!!!!');
});
