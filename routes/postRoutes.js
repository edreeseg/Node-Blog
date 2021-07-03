const express = require('express');
const router = express.Router();
const post = require('../data/helpers/postDb');

router.get('/', (req, res) => {
  post
    .get()
    .then(posts => res.json({ posts }))
    .catch(err =>
      res
        .status(500)
        .json({ error: 'There was an error while retrieving the posts.' })
    );
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  post
    .get(id)
    .then(post => res.json(post))
    .catch(err =>
      JSON.stringify(err) === '{}' // Does it only return this when there is no post by that ID?  Or is this the only error message?
        ? res.status(404).json({ error: 'There is no post with that ID' })
        : res
            .status(500)
            .json({ error: 'There was an error while retrieving that post.' })
    );
});

router.post('/', (req, res) => {
  const [userId, text] = [Number(req.body.userId), req.body.text];
  if (!userId || !text)
    return res.status(400).json({
      error:
        'Please provide both an existing user ID and text content for post.',
    });
  user
    .get(userId)
    .then(user => (user ? post.insert({ userId, text }) : Promise.reject(404)))
    .then(info => post.get(info.id))
    .then(post => res.status(201).json(post))
    .catch(err => {
      if (err === 404)
        res.status(404).json({ error: 'No user found with provided userId.' });
      else
        res
          .status(500)
          .json({ error: 'Error occured while retrieving user infromation.' });
    });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  if (Object.keys(req.body).some(key => key !== 'text'))
    return res
      .status(400)
      .json({ error: 'Request body must only include updated text value.' });
  post
    .update(id, req.body)
    .then(n => (n ? post.get(id) : Promise.reject(404)))
    .then(post => res.json(post))
    .catch(err => {
      if (err === 404)
        res.status(404).json({ error: 'No post by provided ID found.' });
      else
        res.status(500).json({ error: 'Error occurred while updating post.' });
    });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  post
    .remove(id)
    .then(n => (n ? post.get() : Promise.reject(404)))
    .then(posts => res.json({ posts }))
    .catch(err => {
      if (err === 404)
        res.status(404).json({ error: 'No post with that ID found.' });
      else
        res
          .status(500)
          .json({ error: 'Error occurred while attempting to delete post.' });
    });
});

module.exports = router;
