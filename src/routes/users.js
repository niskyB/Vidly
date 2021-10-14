const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const { getUserById, getUserByEmail, createUser } = require('../connection/userConnector');

// GET get the current user's information 
router.get('/me', auth, async(req, res) => {
    // check user is login or not
    if (req.user === undefined) return res.status(400).send('You are not login.');

    // find user in database
    const results = await getUserById(User, req.user.id);

    // respone user's information
    const user = {
        username: results.username,
        email: results.email,
        isAdmin: results.isAdmin
    }
    res.send(user);
});

// POST create a new user and save to database
router.post('/', async(req, res) => {
    // check request body 
    const error = User.validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check existed email
    const results = await getUserByEmail(User, req);
    if (results.length != 0) return res.status(400).send('Email already registered.');

    // encrypt password
    let password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    // generate userId
    const userId = uuidv4().substr(1, User.idLength);
    const user = new User(userId, req.body.username, req.body.email, req.body.password, req.body.isAdmin);

    // save to database
    await createUser(User, req, userId, password);

    // generate token
    const token = user.generateAuthToken();

    // respone user's information with token in header
    res.header('x-auth-token', token).send({
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
    });
});

module.exports = router;