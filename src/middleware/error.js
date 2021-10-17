const winston = require('winston');
const status = require('../constants/status');

module.exports = function(err, req, res, next) {
    winston.error(err.message, err);

    res.status(status.INTERNAL_SERVER_ERROR).send('Something failed.');
}