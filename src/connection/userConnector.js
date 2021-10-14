const { promisePool } = require('../connection/dbConnector');

async function getUserById(User, id) {
    const results = await promisePool.query('SELECT * FROM ?? WHERE ?? = ?', [User.dbName, "userId", id]);
    return results[0][0];
}

async function getUserByEmail(User, req) {
    const results = await promisePool.query('SELECT * FROM ?? WHERE ?? = ?', [User.dbName, "email", req.body.email]);
    return results[0];
}

async function createUser(User, req, userId, password) {
    await promisePool.query('INSERT INTO ??(userId, username, email, password, isAdmin) VALUES(?, ?, ?, ?, ?)', [User.dbName, userId, req.body.username, req.body.email, password, req.body.isAdmin]);
}
exports.getUserById = getUserById;
exports.getUserByEmail = getUserByEmail;
exports.createUser = createUser;