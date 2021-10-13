const { promisePool } = require('./dbConnector');

module.exports = async function(User, req) {
    const results = await promisePool.query('SELECT * FROM ?? WHERE email = ?', [User.dbName, req.body.email]);
    return results[0][0];
}