const { promisePool } = require('../connection/dbConnector');

async function getCustomerList(Customer) {
    const results = await promisePool.query('SELECT * FROM ??', [Customer.dbName]);
    return results[0];
}

async function getCustomerById(Customer, req) {
    const results = await promisePool.query('SELECT * FROM ?? WHERE ?? = ?', [Customer.dbName, "customerId", req.params.id]);
    return results[0][0];
}

async function createCustomer(Customer, req, customerId) {
    await promisePool.query("INSERT INTO ??(customerId, customerName, phone, isGold) VALUES(?, ?, ?, ?)", [Customer.dbName, customerId, req.body.customerName, req.body.phone, req.body.isGold]);
}

async function updateCustomer(Customer, req) {
    const results = await promisePool.query("UPDATE ?? SET customerName = ?, phone = ?, isGold = ? WHERE customerId = ?", [Customer.dbName, req.body.customerName, req.body.phone, req.body.isGold, req.params.id]);
    if (results[0].affectedRows === 0) return false;
    return true;
}

async function deleteCustomer(Customer, req) {
    const results = await promisePool.query("DELETE FROM ?? WHERE customerId = ?", [Customer.dbName, req.params.id]);
    if (results[0].affectedRows === 0) return false;
    return true;
}

exports.getCustomerList = getCustomerList;
exports.getCustomerById = getCustomerById;
exports.createCustomer = createCustomer;
exports.updateCustomer = updateCustomer;
exports.deleteCustomer = deleteCustomer;