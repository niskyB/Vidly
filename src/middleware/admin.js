const status = require('../constants/status');

module.exports = function(req, res, next) {
    if (req.user.isAdmin === 1) return res.status(status.FORBIDDEN).send('Access denied.');
    next();
}