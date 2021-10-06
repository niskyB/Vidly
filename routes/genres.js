const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { dbConfig } = require('../utils/db');
const { Genre, validate } = require('../models/genre');
const { v4: uuidv4 } = require('uuid');

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
    const genreId = uuidv4().substr(1, Genre.idLength);
    // insert to db 
    await sql.query `INSERT INTO tbl_Genre(genreId, genreName) VALUES(${genreId}, ${req.body.genreName})`;
    res.send('Add genre successful.');
});

router.put('/:id', async(req, res) => {
    await sql.connect(dbConfig);
    // check params
    const error = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // update to db
    const result = await sql.query `UPDATE tbl_Genre SET genreName = ${req.body.genreName} WHERE genreId = ${req.params.id}`;
    if (result.rowsAffected[0] === 0) return res.status(404).send('The genre with the given ID was not found.');
    res.send('Update genre successful');
});

router.delete('/:id', async(req, res) => {
    await sql.connect(dbConfig);
    // delete in db
    const result = await sql.query `DELETE tbl_Genre WHERE genreId = ${req.params.id}`;
    if (result.rowsAffected[0] === 0) return res.status(404).send('The genre with the given ID was not found.');
    res.send('Delete genre successful');
});

module.exports = router;