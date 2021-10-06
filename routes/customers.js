const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { validate, Customer } = require('../models/customer');
const { dbConfig } = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

router.get('/', async(req, res) => {
    await sql.connect(dbConfig);
    const customers = await sql.query `SELECT * FROM tbl_Customer`;
    if (customers.recordset[0] == undefined) return res.status(404).send('The customer list is empty.');
    res.send(customers.recordset);
});

router.get('/:id', async(req, res) => {
    await sql.connect(dbConfig);
    const customer = await sql.query `SELECT * FROM tbl_Customer WHERE customerId = ${req.params.id}`
    if (customer.recordset[0] == undefined) return res.status(404).send('The customer with the given ID was not found.');
    res.send(customer.recordset[0]);
});

router.post('/', async(req, res) => {
    await sql.connect(dbConfig);
    // check param
    const error = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // creat uuid
    const customerId = uuidv4().substr(1, Customer.idLength);
    // insert to db
    await sql.query `INSERT INTO tbl_Customer(customerId, fullName, phone, isGold) VALUES(${customerId}, ${req.body.fullName}, ${req.body.phone}, ${req.body.isGold})`;
    res.send('Add customer successful.');
});

router.put('/:id', async(req, res) => {
    await sql.connect(dbConfig);
    // check param
    const error = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // update to db
    const result = await sql.query `UPDATE tbl_Customer SET fullName = ${req.body.fullName}, phone = ${req.body.phone}, isGold = ${req.body.isGold} WHERE customerId = ${req.params.id}`;
    if (result.rowsAffected[0] === 0) return res.status(404).send('The customer with the given ID was not found.');
    res.send('Update customer successful');
});

router.delete('/:id', async(req, res) => {
    await sql.connect(dbConfig);
    // delete in db
    const result = await sql.query `DELETE tbl_Customer WHERE customerId = ${req.params.id}`;
    if (result.rowsAffected[0] === 0) return res.status(404).send('The customer with the given ID was not found.');
    res.send('Delete customer successful');
});

module.exports = router;