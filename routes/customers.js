const express = require('express');
const router = express.Router();
const { connect } = require('../utils/dbConnector');
const { Customer } = require('../models/customer');
const { v4: uuidv4 } = require('uuid');

router.get('/', async(req, res) => {
    connect(req, res, 'SELECT * FROM ??', [Customer.dbName],
        function(error, results, fields) {
            if (error) res.status(500).send('Something went wrong.');
            else {
                if (results[0] === undefined) res.status(404).send('The customer list is empty.');
                else res.send(results[0]);
            }
        })
});

router.get('/:id', async(req, res) => {
    connect(req, res, 'SELECT * FROM ?? WHERE ?? = ?', [Customer.dbName, "customerId", req.params.id],
        function(error, results, fields) {
            if (error) res.status(500).send('Something went wrong.');
            else {
                if (results[0] === undefined) res.status(404).send('The customer with the given ID was not found.');
                else res.send(results[0]);
            }
        });
});

router.post('/', async(req, res) => {
    const error = Customer.validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customerId = uuidv4().substr(1, Customer.idLength);
    connect(req, res, "INSERT INTO ??(customerId, customerName, phone, isGold) VALUES(?, ?, ?, ?)", [Customer.dbName, customerId, req.body.customerName, req.body.phone, req.body.isGold],
        function(error, results, fields) {
            if (error) res.status(500).send('Something went wrong.');
            else {
                if (results.affectedRows === 0) res.status(500).send('Something was wrong.');
                else res.send('Add customer successful.');
            }
        });
});

router.put('/:id', async(req, res) => {
    const error = Customer.validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    connect(req, res, "UPDATE ?? SET customerName = ?, phone = ?, isGold = ? WHERE customerId = ?", [Customer.dbName, req.body.customerName, req.body.phone, req.body.isGold, req.params.id],
        function(error, results, fields) {
            if (error) res.status(500).send('Something went wrong.');
            else {
                if (results.affectedRows === 0) res.status(404).send('The customer with the given ID was not found.');
                else res.send('Update customer successful.');
            }
        });
});

router.delete('/:id', async(req, res) => {
    connect(req, res, "DELETE FROM ?? WHERE customerId = ?", [Customer.dbName, req.params.id],
        function(error, results, fields) {
            if (error) res.status(500).send('Something went wrong.');
            else {
                if (results.affectedRows === 0) res.status(404).send('The customer with the given ID was not found.');
                else res.send('Delete customer successful.');
            }
        });
});

module.exports = router;