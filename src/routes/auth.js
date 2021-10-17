const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const { getResponseForm } = require('../utils/helper');
const status = require('../constants/status');

// POST verify email and password then generate auth token if email and password are valid.
router.post('/', async(req, res) => {
    // check request body
    const error = validate(req.body);
    if (error) return res.status(status.BAD_REQUEST).send(getResponseForm(null, error, "Invalid params"));

    // find email in database
    const results = await require('../connection/authConnector')(User, req);
    if (results === undefined) return res.status(status.BAD_REQUEST).send(getResponseForm(null, null, 'Ivalid email or password.'));

    // check password
    const user = new User(results.userId, results.username, req.body.email, results.password, results.isAdmin);
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(status.BAD_REQUEST).send(getResponseForm(null, null, 'Ivalid email or password.'));

    // generate auth token
    const token = user.generateAuthToken();

    // respone token 
    res.cookie("x-auth-token", token, {
        maxAge: 86400 * 100,
    });
    res.send(getResponseForm(null, null, "login successfully."));
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