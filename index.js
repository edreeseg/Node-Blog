const express = require('express');
const post = require('./data/helpers/postDb');
const user = require('./data/helpers/userDb');
const tag = require('./data/helpers/tagDb');

const server = express();
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

const port = 5000;

server.get('/users', (req, res) => {
    user.get()
        .then(users => res.json({ users }))
        .catch(err => console.log(err));
});

server.get('/users/:id', (req, res) => {
    const id = req.params.id;
    if (Number.isNaN(Number(id))) return res.status(400).json({ error: 'Please enter ID in the form of a number' });
    user.get(id)
        .then(user => {
            if (!user) res.status(404).json({ error: 'Provided ID is not associated with any user.' });
            else res.json(user);
        })
        .catch(err => res.status(500).json({ error: 'There was an error while trying to retrieve user\'s information' }) );
});

server.post('/users', (req, res) => {
    if (!req.body.name) return res.status(400).json({ error: 'Request body must include new user\'s name.' });
    user.insert({ name: req.body.name })
        .then(result => {
            user.get(result.id)
                .then(user => res.status(201).json(user))
                .catch(err => res.status(500).json({ error: 'There was an error while trying to respond with added user\'s information.'}));
        })
        .catch(err => res.status(500).json({ error: 'There was an error while trying to add new user.' }));
});

server.put('/users/:id', (req, res) => {
    const id = req.params.id;
    if (Number.isNaN(Number(id))) return res.status(400).json({ error: 'Please enter ID in the form of a number' });
    if (!req.body.name) return res.status(400).json({ error: 'Please enter name value for update.' });
    if (Object.keys(req.body).length > 1) return res.status(400).json({ error: 'Please only provide name value to update.' });
    user.update(id, req.body)
        .then(n => {
            user.get(id)
                .then(user => res.json(user))
                .catch(err => res.status(500).json({ error: 'There was an error after updating user information.' }));
        })
        .catch(err => res.status(500).json({ error: err }));
});

server.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    if (Number.isNaN(Number(id))) return res.status(400).json({ error: 'Please enter ID in the form of a number' });
    user.remove(id)
        .then(n => {
            user.get()
                .then(users => n == 1 ? res.json({ users }) : res.status(404).json({ error: 'No user by that ID found.' }))
                .catch(err => res.status(500).json({ error: 'There was an error after deleting user.' }));
        })
        .catch(err => res.status(500).json({ error: 'There was an error while trying to delete user.' }));
});

server.listen(5000, () => {
    console.log(`Server listening on port ${port}.`);
});