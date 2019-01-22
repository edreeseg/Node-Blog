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
    const name = req.body.name;
    if (!name) return res.status(400).json({ error: 'Request body must include \'name\' key for new user.' });
    if (name.length > 128) return res.status(400).json({ error: 'New user\'s name must be 128 characters or less.' });
    user.insert({ name })
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

server.get('/posts', (req, res) => {
    post.get()
        .then(posts => res.json({ posts }))
        .catch(err => res.status(500).json({ error: 'There was an error while retrieving the posts.' }));
});

server.get('/posts/:id', (req, res) => {
    const id = req.params.id;
    post.get(id)
        .then(post => res.json(post))
        .catch(err => JSON.stringify(err) === '{}'  // Does it only return this when there is no post by that ID?  Or is this the only error message?
            ? res.status(404).json({ error: 'There is no post with that ID' })
            : res.status(500).json({ error: 'There was an error while retrieving that post.' }));
});

server.post('/posts', (req, res) => {
    const [userId, text] = [Number(req.body.userId), req.body.text];
    if (!userId || !text) return res.status(400).json({ error: 'Please provide both an existing user ID and text content for post.' });
    user.get(userId)
        .then(user => {
            if (!user) return res.status(404).json({ error: 'No user associated with provided user ID.' });
            post.insert({ userId, text })
                .then(info => {
                    post.get(info.id)
                        .then(post => res.status(201).json(post))
                        .catch(err => res.status(500).json({ error: 'Error occurred after adding post.' }));
                })
                .catch(err => res.status(500).json({ error: 'Error occurred while adding post.' }));
        })
        .catch(err => res.status(500).json({ error: 'Error occured while retrieving user infromation.' }));
});

server.put('/posts/:id', (req, res) => {
    const id = req.params.id;
    if (Object.keys(req.body).some(key => key !== 'text')) return res.status(400).json({ error: 'Request body must only include updated text value.' });
    post.update(id, req.body)
        .then(n => {
            if (!n) return res.status(404).json({ error: 'Could not find post by provided ID.' });
            post.get(id)
                .then(post => res.json(post))
                .catch(err => res.status(500).json({ error: 'Error occurred after updating post.' }));
        })
        .catch(err => res.status(500).json({ error: 'Error occurred while updating post.' }));
});

server.delete('/posts/:id', (req, res) => {
    const id = req.params.id;
    post.remove(id)
        .then(n => {
            if (!n) return res.status(404).json({ error: 'Could not find post by provided ID.' });
            post.get()
                .then(posts => res.json({ posts }))
                .catch(err => res.status(500).json({ error: 'Error occurred after deleting post.' }));
        })
        .catch(err => res.status(500).json({ error: 'Error occurred while attempting to delete post.' }));
});

server.get('/users/:id/posts', (req, res) => {
    const id = Number(req.params.id);
    post.get()
        .then(posts => res.json({ posts: posts.filter(x => x.userId === id) }))
        .catch(err => res.status(500).json({ error: 'Error occurred while retrieving user\'s posts' }));
})

server.listen(5000, () => {
    console.log(`Server listening on port ${port}.`);
});