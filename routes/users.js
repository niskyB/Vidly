const express = require('express');
const router = express.Router();
const { connect, pool, promisePool } = require('../utils/dbConnector');
const { User } = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

router.get('/me', async(req, res) => {
    const results = await promisePool.query('SELECT * FROM ?? WHERE ?? = ?', [User.dbName, "userId", req.user.id]);
    const user = {
        username: results[0][0].username,
        email: results[0][0].email,
        isAdmin: results[0][0].isAdmin
    }
    res.send(user);
});

router.post('/', async(req, res) => {
    const error = User.validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const results = await promisePool.query('SELECT * FROM ?? WHERE ?? = ?', [User.dbName, "email", req.body.email]);
    if (results[0].length === 0) return res.status(400).send('Email already registered.');

    let password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const userId = uuidv4().substr(1, User.idLength);
    await promisePool.query('INSERT INTO ??(userId, username, email, password, isAdmin) VALUES(?, ?, ?, ?, ?)', [userId, req.body.username, req.body.email, password, req.body.isAdmin]);

});

module.exports = router;