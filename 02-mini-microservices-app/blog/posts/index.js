const express = require('express');
// const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

const app = express();
// app.use(bodyParser.json());
app.use(express.json());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts', (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  console.log(id);

  posts[id] = {
    id,
    title
  };

  // 201 Created
  res.status(201).send(posts[id]);
});

app.listening(4000, () => {
  console.log('Listening on 4000');
});
