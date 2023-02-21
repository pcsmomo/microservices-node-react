import express, { json } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

// Swagger docs
import swaggerUi from 'swagger-ui-express';
import { swaggerJsDocSpecs, swaggerUiOptions } from './config/swagger-config';

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
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

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

export { app };
