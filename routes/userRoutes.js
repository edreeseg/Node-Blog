const express = require('express');
const router = express.Router();
const user = require('../data/helpers/userDb');

router.get('/', (req, res) => {
  user
    .get()
    .then(users => res.json({ users }))
    .catch(err =>
      res
        .status(500)
        .json({ error: 'There was an error while retrieving users.' })
    );
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  if (Number.isNaN(Number(id)))
    return res
      .status(400)
      .json({ error: 'Please enter ID in the form of a number' });
  user
    .get(id)
    .then(user => (user ? res.json(user) : Promise.reject(404)))
    .catch(err => {
      if (err === 404)
        res
          .status(404)
          .json({ error: 'Provided ID is not associated with any user.' });
      else
        res.status(500).json({
          error:
            "There was an error while trying to retrieve user's information",
        });
    });
});

router.post('/', (req, res) => {
  const name = req.body.name;
  if (!name)
    return res
      .status(400)
      .json({ error: "Request body must include 'name' key for new user." });
  if (name.length > 128)
    return res
      .status(400)
      .json({ error: "New user's name must be 128 characters or less." });
  user
    .insert({ name })
    .then(result => user.get(result.id))
    .then(user => res.status(201).json(user))
    .catch(err =>
      res
        .status(500)
        .json({ error: 'There was an error while trying to add new user.' })
    );
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  if (Number.isNaN(Number(id)))
    return res
      .status(400)
      .json({ error: 'Please enter ID in the form of a number' });
  if (!req.body.name)
    return res
      .status(400)
      .json({ error: 'Please enter name value for update.' });
  if (Object.keys(req.body).length > 1)
    return res
      .status(400)
      .json({ error: 'Please only provide name value to update.' });
  user
    .update(id, req.body)
    .then(n => user.get(id))
    .then(user => res.json(user))
    .catch(err =>
      res.status(500).json({
        error: 'There was an error while trying to update user information.',
      })
    );
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  if (Number.isNaN(Number(id)))
    return res
      .status(400)
      .json({ error: 'Please enter ID in the form of a number' });
  user
    .remove(id)
    .then(n => (n == 1 ? user.get() : Promise.reject(404)))
    .then(users => res.json({ users }))
    .catch(err => {
      if (err === 404)
        res.status(404).json({ error: 'No user found with provided ID.' });
      else
        res
          .status(500)
          .json({ error: 'There was an error while trying to delete user.' });
    });
});

router.get('/:id/posts', (req, res) => {
  const id = Number(req.params.id);
  user
    .getUserPosts(id)
    .then(posts => res.json({ posts }))
    .catch(err =>
      res
        .status(500)
        .json({ error: "Error occurred while retrieving user's posts" })
    );
});

module.exports = router;
