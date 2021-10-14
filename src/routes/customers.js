const express = require('express');
const router = express.Router();
const { Customer } = require('../models/customer');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth')
const admin = require('../middleware/admin');
const { getCustomerList, getCustomerById, createCustomer, updateCustomer, deleteCustomer } = require('../connection/customerConnector');

// GET get customer list
router.get('/', auth, async(req, res) => {
    // query data
    const results = await getCustomerList(Customer);

    // check the results
    if (results.length === 0) res.status(404).send('The customer list is empty.');
    else res.send(results);
});

// GET get customer by given id
router.get('/:id', auth, async(req, res) => {
    // query data
    const customer = await getCustomerById(Customer, req.params.id);

    // check the results
    if (customer === undefined) res.status(404).send('The customer with the given ID was not found.');
    else res.send(customer);
});

// POST create a new customer and save to database
router.post('/', auth, async(req, res) => {
    // check request body
    const error = Customer.validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // generate customerId
    const customerId = uuidv4().substr(1, Customer.idLength);

    // insert into database
    await createCustomer(Customer, req, customerId);
    res.send('Add customer successful.');
});

// PUT update customer's information
router.put('/:id', auth, async(req, res) => {
    // check request body
    const error = Customer.validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // update to database and check the results
    if (!await updateCustomer(Customer, req)) res.status(404).send('The customer with the given ID was not found.');
    else res.send('Update customer successful.');
});

// DELETE remove customer from database
router.delete('/:id', [auth, admin], async(req, res) => {
    // delete from database and check the results 
    if (!await deleteCustomer(Customer, req)) res.status(404).send('The customer with the given ID was not found.');
    else res.send('Delete customer successful.');
});

module.exports = router;