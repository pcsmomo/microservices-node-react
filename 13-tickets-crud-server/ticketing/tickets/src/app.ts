import express, { json } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

// Routes
import { createTicketRouter } from './routes/new';

// common Middlewares and Errors
import { errorHandler, NotFoundError, currentUser } from '@dwktickets/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser); // this must be after use cookieSession

app.use(createTicketRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };