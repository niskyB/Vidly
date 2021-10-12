const express = require('express');
const router = express.Router();
const { connect, pool, promisePool } = require('../utils/dbConnector');
const { User } = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

// GET get the current user's information 
router.get('/me', auth, async(req, res) => {
    // check user is login or not
    if (req.user === undefined) return res.status(400).send('You are not login.');

    // find user in database
    const results = await promisePool.query('SELECT * FROM ?? WHERE ?? = ?', [User.dbName, "userId", req.user.id]);

    // respone user's information
    const user = {
        username: results[0][0].username,
        email: results[0][0].email,
        isAdmin: results[0][0].isAdmin
    }
    res.send(user);
});

// POST create a new user and save to database
router.post('/', auth, async(req, res) => {
    // check request body
    const error = User.validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check existed email
    const results = await promisePool.query('SELECT * FROM ?? WHERE ?? = ?', [User.dbName, "email", req.body.email]);
    if (results[0].length != 0) return res.status(400).send('Email already registered.');

    // encrypt password
    let password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    // generate userId
    const userId = uuidv4().substr(1, User.idLength);
    const user = new User(userId, req.body.username, req.body.email, req.body.password, req.body.isAdmin);

    // save to database
    await promisePool.query('INSERT INTO ??(userId, username, email, password, isAdmin) VALUES(?, ?, ?, ?, ?)', [User.dbName, userId, req.body.username, req.body.email, password, req.body.isAdmin]);

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