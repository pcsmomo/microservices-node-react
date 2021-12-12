const express = require('express');
const cors = require('cors');

// middlewares
const app = express();
app.use(express.json());
app.use(cors());

const posts = {};
// QUICK EXAMPLE
// POSTS === {
//   '123asdf': {
//     id: '123asdf',
//     title: 'post title',
//     comments: [
//       { id: '9kvs8', content: 'content' }
//     ]
//   }
// }

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  console.log(posts);

  res.send({});
});

app.listen(4002, () => {
  console.log('Listening on 4002');
});
