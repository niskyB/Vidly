const express = require('express');
const router = express.Router();
const { connect } = require('../utils/dbConnector');
const { Movie } = require('../models/movie');
const { v4: uuidv4 } = require('uuid');

router.get('/', async(req, res) => {
    connect(req, res, 'SELECT * FROM ??', [Movie.dbName],
        function(error, results, fields) {
            if (error) res.status(500).send('Something went wrong.');
            else {
                if (results[0] === undefined) res.status(404).send('The movie list is empty.');
                else res.send(results);
            }
        });
});

router.get('/:id', async(req, res) => {
    connect(req, res, 'SELECT * FROM ?? WHERE ?? = ?', [Movie.dbName, "movieId", req.params.id],
        function(error, results, fields) {
            if (error) res.status(500).send('Something went wrong.');
            else {
                if (results[0] === undefined) res.status(404).send('The movie with the given ID was not found.');
                else res.send(results[0]);
            }
        });
});

router.post('/', async(req, res) => {
    const error = Movie.validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const movieId = uuidv4().substr(1, Movie.idLength);
    connect(req, res, "INSERT INTO ??(movieId, title, numberInStock, dailyRentalRate, genreId) VALUES(?, ?, ?, ?, ?)", [Movie.dbName, movieId, req.body.title, req.body.numberInStock, req.body.dailyRentalRate, req.body.genreId],
        function(error, results, fields) {
            if (error) res.status(500).send('Something went wrong.');
            else {
                if (results.affectedRows === 0) res.status(500).send('Something was wrong.');
                else res.send('Add movie successful.');
            }
        });
});

router.put('/:id', async(req, res) => {
    const error = Movie.validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    connect(req, res, "UPDATE ?? SET title = ?, numberInStock = ?, dailyRentalRate = ?, genreId = ? WHERE movieId = ?", [Movie.dbName, req.body.title, req.body.numberInStock, req.body.dailyRentalRate, req.body.genreId, req.params.id],
        function(error, results, fields) {
            if (error) res.status(500).send('Something went wrong.');
            else {
                if (results.affectedRows === 0) res.status(404).send('The movie with the given ID was not found.');
                else res.send('Update movie successful.');
            }
        });
});

router.delete('/:id', async(req, res) => {
    connect(req, res, "DELETE FROM ?? WHERE movieId = ?", [Movie.dbName, req.params.id],
        function(error, results, fields) {
            if (error) res.status(500).send('Something went wrong.');
            else {
                if (results.affectedRows === 0) res.status(404).send('The movie with the given ID was not found.');
                else res.send('Delete movie successful.');
            }
        });
});

module.exports = router;