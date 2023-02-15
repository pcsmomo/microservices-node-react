import express, { json } from 'express';

import { currentUserRouter } from './routes/current-user';

const app = express();
app.use(json());

app.use(currentUserRouter);

// The port wouldn't matter when we start kubernetes
app.listen(3000, () => {
  console.log('Listening on port 3000!!!!!!');
});
