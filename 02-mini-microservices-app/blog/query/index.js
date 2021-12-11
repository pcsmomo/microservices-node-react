const express = require('express');
const cors = require('cors');

// middlewares
const app = express();
app.use(express.json());
app.use(cors());

app.get('/posts', (req, res) => {});

app.get('/events', (req, res) => {});

app.listen(4002, () => {
  console.log('Listening on 4002');
});
