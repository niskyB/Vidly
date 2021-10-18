const status = require('../constants/status');
const multer = require('multer');

module.exports = function multerErrorMiddleware(multerAction) {
    return (req, res, next) => {
        multerAction(req, res, err => {
            if (err instanceof multer.MulterError) {
                return res.status(status.BAD_REQUEST).send(err.message);
            } else if (err) {
                return res.status(status.BAD_REQUEST).send(err);
            }
            next();
        });
    };
}