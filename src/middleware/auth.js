const jwt = require('jsonwebtoken');
const config = require('config');
const status = require('../constants/status');

function auth(req, res, next) {
    const token = req.cookies["x-auth-token"];
    if (!token) return res.status(status.UNAUTHENTICATED).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(status.BAD_REQUEST).send('Invalid token.');
    }
}

module.exports = auth;