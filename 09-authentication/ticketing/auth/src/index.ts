import express, { json } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerJsDocSpecs, swaggerUiOptions } from './config/swagger-config';
import 'express-async-errors';
import mongoose from 'mongoose';

// Routes
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

// Errors
import { NotFoundError } from './errors/not-found-error';

// Middlewares
import { errorHandler } from './middlewares/error-handler';

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

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  // Connect to the database
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.info('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  // The port wouldn't matter when we start kubernetes
  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!');
  });
};

start();
