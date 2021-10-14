const express = require('express');
const router = express.Router();
const { Rental } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const auth = require('../middleware/auth');
const { getRentalList, getRentalById, createRental } = require('../connection/rentalConnector');

// GET get rental list
router.get('/', auth, async(req, res) => {
    // query data
    const results = await getRentalList(Rental);

    // check the results
    if (results.length === 0) res.status(404).send('The rental list is empty.');
    else res.send(results);
});

// GET rental by given id
router.get('/:id', auth, async(req, res) => {
    // query data
    const results = await getRentalById(Rental, req);

    // check the results
    if (results === undefined) res.status(404).send('The rental with the given ID was not found.');
    else res.send(results);
});

// POST creat a new rental and save to database
router.post('/', auth, async(req, res) => {
    // check request body
    const error = Rental.validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // connect to database
    await createRental(Rental, req, Customer, Movie, res);
});

module.exports = router;