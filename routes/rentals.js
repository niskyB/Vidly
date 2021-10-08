const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { dbConfig } = require('../utils/db');
const { v4: uuidv4 } = require('uuid');
const { Rental, validate } = require('../models/rental');

router.get('/', async(req, res) => {
    await sql.connect(dbConfig);
    const rentals = await sql.query `SELECT * FROM tbl_Rental`;
    if (rentals.recordset[0] == undefined) return res.status(404).send('The rental list is empty.');
    res.send(rentals.recordset);
});

router.get('/:id', async(req, res) => {
    await sql.connect(dbConfig);
    const rental = await sql.query `SELECT * FROM tbl_Rental WHERE rentalId = ${req.params.id}`;
    if (rental.recordset[0] == undefined) return res.status(404).send('The rental with the given ID was not found.');
    res.send(rental.recordset);
});

router.post('/', async(req, res) => {
    await sql.connect(dbConfig);
    const error = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await sql.query `SELECT * FROM tbl_Customer WHERE customerId = ${req.body.customerId}`;
    if (customer.recordset[0] == undefined) return res.status(404).send('Invalid customer.');

    const movie = await sql.query `SELECT * FROM tbl_Movie WHERE movieId = ${req.body.movieId}`;
    if (movie.recordset[0] == undefined) return res.status(404).send('Invalid movie.');

    const rentalId = uuidv4().substr(1, Rental.idLength);
    const newNumberInStock = movie.recordset[0].numberInStock - 1;
    await sql.query `INSERT INTO tbl_Rental(rentalId, customerId, movieId) VALUES(${rentalId}, ${req.body.customerId}, ${req.body.movieId})`;
    await sql.query `UPDATE tbl_Movie SET numberInStock = ${newNumberInStock} WHERE movieId = ${req.body.movieId}`;
    res.send('Add genre successful.');
});

router.put('/:id', async(req, res) => {

});

router.delete("/:id", async(req, res) => {
    await sql.connect(dbConfig);
    // delete in db
    const result = await sql.query `DELETE tbl_Rental WHERE rentalId = ${req.params.id}`;
    if (result.rowsAffected[0] === 0) return res.status(404).send('The rental with the given ID was not found.');
    res.send('Delete genre successful');
});

module.exports = router;