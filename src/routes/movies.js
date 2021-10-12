const express = require('express');
const router = express.Router();
const { promisePool } = require('../utils/dbConnector');
const { Movie } = require('../models/movie');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET get movie list
router.get('/', auth, async(req, res) => {
    // query data
    const results = await promisePool.query('SELECT * FROM ??', [Movie.dbName]);

    // check the results
    if (results[0].length === 0) res.status(404).send('The movie list is empty.');
    else res.send(results[0]);
});

// GET get movie by given id
router.get('/:id', auth, async(req, res) => {
    // query data
    const results = await promisePool.query('SELECT * FROM ?? WHERE ?? = ?', [Movie.dbName, "movieId", req.params.id]);

    // check the results
    if (results[0].length === 0) res.status(404).send('The movie with the given ID was not found.');
    else res.send(results[0][0]);
});

// POST create a new movie and save to database
router.post('/', [auth, admin], async(req, res) => {
    // check request body
    const error = Movie.validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // generate movieId
    const movieId = uuidv4().substr(1, Movie.idLength);

    // insert into database
    await promisePool.query("INSERT INTO ??(movieId, title, numberInStock, dailyRentalRate, genreId) VALUES(?, ?, ?, ?, ?)", [Movie.dbName, movieId, req.body.title, req.body.numberInStock, req.body.dailyRentalRate, req.body.genreId]);
    res.send('Add movie successful.');
});

// PUT update movie's information
router.put('/:id', [auth, admin], async(req, res) => {
    // check request body
    const error = Movie.validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // update to database
    const results = await promisePool.query("UPDATE ?? SET title = ?, numberInStock = ?, dailyRentalRate = ?, genreId = ? WHERE movieId = ?", [Movie.dbName, req.body.title, req.body.numberInStock, req.body.dailyRentalRate, req.body.genreId, req.params.id]);

    // check the results
    if (results[0].affectedRows === 0) res.status(404).send('The movie with the given ID was not found.');
    else res.send('Update movie successful.');
});

// DELETE remove movie from database
router.delete('/:id', [auth, admin], async(req, res) => {
    // delete from database
    const results = await promisePool.query("DELETE FROM ?? WHERE movieId = ?", [Movie.dbName, req.params.id]);

    // check the results
    if (results[0].affectedRows === 0) res.status(404).send('The movie with the given ID was not found.');
    else res.send('Delete movie successful.');
});

module.exports = router;