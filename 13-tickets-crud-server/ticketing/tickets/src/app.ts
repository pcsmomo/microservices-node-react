import express, { json } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

// Routes

// common Middlewares and Errors
import { errorHandler, NotFoundError } from '@dwktickets/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
