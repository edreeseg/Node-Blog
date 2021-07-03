const express = require('express');
const cors = require('cors');
const tag = require('./data/helpers/tagDb');

const server = express();
server.use(cors());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

const port = 5000;

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const upperMiddleware = (req, res, next) => {
  if (req.body.name) {
    if (req.method === 'POST' || req.method === 'PUT')
      req.body.name = req.body.name.toUpperCase();
  }
  next();
};

server.use(upperMiddleware);
server.use('/users', userRoutes);
server.use('/posts', postRoutes);

server.get('/', (req, res) => {
  res.send('Please direct operations to /users or /posts endpoints.');
});

server.listen(5000, () => {
  console.log(`Server listening on port ${port}.`);
});
