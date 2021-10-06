const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { dbConfig } = require('../utils/db');
const { Genre, validate } = require('../models/genre');

router.get('/', async(req, res) => {
    await sql.connect(dbConfig);
    const genres = await sql.query `SELECT * FROM tbl_Genre`;
    if (genres.recordset[0] == undefined) return res.status(404).send('The genre list is empty.');
    res.send(genres.recordset);
});

router.get('/:id', async(req, res) => {
    await sql.connect(dbConfig);
    const genre = await sql.query `SELECT * FROM tbl_Genre WHERE genreId = ${req.params.id}`;
    if (genre.recordset[0] == undefined) return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre.recordset[0]);
});

router.post('/', async(req, res) => {
    await sql.connect(dbConfig);
    // check params
    const error = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // create uuid

});

router.put('/:id', async(req, res) => {

});

router.delete('/:id', async(req, res) => {

});

module.exports = router;