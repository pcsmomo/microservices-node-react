import express, { json } from 'express';

const app = express();
app.use(json());

app.get('/api/users/currentuser', (req, res) => {
  res.send('Hi there!');
});

// The port wouldn't matter when we start kubernetes
app.listen(3000, () => {
  console.log('Listening on port 3000!!!!!!');
});
