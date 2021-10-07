const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movie');
const sql = require('mssql');
const { dbConfig } = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

router.get('/', async(req, res) => {
    await sql.connect(dbConfig);
    const movies = await sql.query `SELECT * FROM tbl_Movie`;
    if (movies.recordset[0] == undefined) return res.status(404).send('The movie list is empty.');
    res.send(movies.recordset);
});

router.get('/:id', async(req, res) => {
    await sql.connect(dbConfig);
    const movie = await sql.query `SELECT * FROM tbl_Movie WHERE movieId = ${req.params.id}`;
    if (movie.recordset[0] == undefined) return res.status(404).send('The movie with the given ID was not found.');
    res.send(movie.recordset[0]);
});

router.post('/', async(req, res) => {
    await sql.connect(dbConfig);
    // check params
    const error = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // check genreId
    const genre = await sql.query `SELECT * FROM tbl_Genre WHERE genreId = ${req.body.genreId}`;
    if (genre.recordset[0] == undefined) return res.status(404).send('Invalid genre.');
    // create uuid
    const movieId = uuidv4().substr(1, Movie.idLength);
    // insert to db 
    await sql.query `INSERT INTO tbl_Movie(movieId, title, genreId, numberInStock, dailyRentalRate) VALUES(${movieId}, ${req.body.title}, ${req.body.genreId}, ${req.body.numberInStock}, ${req.body.dailyRentalRate})`;
    res.send('Add genre successful.');
});

router.put('/:id', async(req, res) => {
    await sql.connect(dbConfig);
    // check params
    const error = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // check genreId
    const genre = await sql.query `SELECT * FROM tbl_Genre WHERE genreId = ${req.body.genreId}`;
    if (genre.recordset[0] == undefined) return res.status(404).send('Invalid genre.');
    // update to db
    const result = await sql.query `UPDATE tbl_Movie SET title = ${req.body.title}, genreId = ${req.body.genreId}, numberInStock = ${req.body.numberInStock}, dailyRentalRate = ${req.body.dailyRentalRate} WHERE movieId = ${req.params.id}`;
    if (result.rowsAffected[0] === 0) return res.status(404).send('The movie with the given ID was not found.');
    res.send('Update genre successful');
});

router.delete('/:id', async(req, res) => {
    await sql.connect(dbConfig);
    // delete in db
    const result = await sql.query `DELETE tbl_Movie WHERE movieId = ${req.params.id}`;
    if (result.rowsAffected[0] === 0) return res.status(404).send('The movie with the given ID was not found.');
    res.send('Delete genre successful');
});

module.exports = router;