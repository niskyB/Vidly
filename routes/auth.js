const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const { promisePool } = require('../utils/dbConnector');

router.post('/', async(req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let results = await promisePool.query('SELECT * FROM ?? WHERE email = ?', [User.dbName, req.body.email]);
    if (results[0].length === 0) return res.status(400).send('Ivalid email or password.');

    const user = new User(results[0][0].userId, results[0][0].username, req.body.email, results[0][0].password, results[0][0].isAdmin);
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Ivalid email or password.');

    const token = user.generateAuthToken();

    res.send(token);
});

function validate(user) {
    const schema = Joi.object({
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().required()
    });

    const { error } = schema.validate(user);
    return error;
}

module.exports = router;