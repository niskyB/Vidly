const express = require('express');
const router = express.Router();
const { promisePool } = require('../connection/dbConnector');
const { Customer } = require('../models/customer');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth')
const admin = require('../middleware/admin');

// GET get customer list
router.get('/', auth, async(req, res) => {
    // query data
    const results = await promisePool.query('SELECT * FROM ??', [Customer.dbName]);

    // check the results
    if (results[0].length === 0) res.status(404).send('The customer list is empty.');
    else res.send(results[0]);
});

// GET get customer by given id
router.get('/:id', auth, async(req, res) => {
    // query data
    const results = await promisePool.query('SELECT * FROM ?? WHERE ?? = ?', [Customer.dbName, "customerId", req.params.id]);

    // check the results
    if (results[0].length === 0) res.status(404).send('The customer with the given ID was not found.');
    else res.send(results[0][0]);
});

// POST create a new customer and save to database
router.post('/', auth, async(req, res) => {
    // check request body
    const error = Customer.validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // generate customerId
    const customerId = uuidv4().substr(1, Customer.idLength);

    // insert into database
    await promisePool.query("INSERT INTO ??(customerId, customerName, phone, isGold) VALUES(?, ?, ?, ?)", [Customer.dbName, customerId, req.body.customerName, req.body.phone, req.body.isGold]);
    res.send('Add customer successful.');
});

// PUT update customer's information
router.put('/:id', auth, async(req, res) => {
    // check request body
    const error = Customer.validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // update to database
    const results = await promisePool.query("UPDATE ?? SET customerName = ?, phone = ?, isGold = ? WHERE customerId = ?", [Customer.dbName, req.body.customerName, req.body.phone, req.body.isGold, req.params.id]);

    // check the results
    if (results[0].affectedRows === 0) res.status(404).send('The customer with the given ID was not found.');
    else res.send('Update customer successful.');
});

// DELETE remove customer from database
router.delete('/:id', [auth, admin], async(req, res) => {
    // delete from database
    const results = await promisePool.query("DELETE FROM ?? WHERE customerId = ?", [Customer.dbName, req.params.id]);

    // check the results
    if (results[0].affectedRows === 0) res.status(404).send('The customer with the given ID was not found.');
    else res.send('Delete customer successful.');
});

module.exports = router;