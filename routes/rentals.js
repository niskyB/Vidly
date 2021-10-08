const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { dbConfig } = require('../utils/db');
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