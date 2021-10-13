const { promisePool } = require('./dbConnector');

module.exports = async function(User, req) {
    const results = await promisePool.query('SELECT * FROM ?? WHERE email = ?', [User.dbName, req.body.email]);
    const user = results[0];
    return user[0];
}