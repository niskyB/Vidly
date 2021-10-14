const express = require('express');
const router = express.Router();
const { promisePool } = require('../connection/dbConnector');
const { Movie } = require('../models/movie');
const { Genre } = require('../models/genre');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { getMovieList, getMovieById, createMovie, updateMovie, deleteMovie } = require('../connection/movieConnector');
const { getGenreById } = require('../connection/genreConnector');

// GET get movie list
router.get('/', auth, async(req, res) => {
    // query data
    const results = await getMovieList(Movie);

    // check the results
    if (results.length === 0) res.status(404).send('The movie list is empty.');
    else res.send(results);
});

// GET get movie by given id
router.get('/:id', auth, async(req, res) => {
    // query data
    const result = await getMovieById(Movie, req.params.id);

    // check the results
    if (result === undefined) res.status(404).send('The movie with the given ID was not found.');
    else res.send(result);
});

// POST create a new movie and save to database
router.post('/', [auth, admin], async(req, res) => {
    // check request body
    const error = Movie.validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check genre
    const genre = await getGenreById(Genre, req.body.genreId);
    if (genre === undefined) return res.status(400).send('Invalid genre');

    // generate movieId
    const movieId = uuidv4().substr(1, Movie.idLength);

    // insert into database
    await createMovie(Movie, req, movieId);
    res.send('Add movie successful.');
});

// PUT update movie's information
router.put('/:id', [auth, admin], async(req, res) => {
    // check request body
    const error = Movie.validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check genre
    const genre = await getGenreById(Genre, req.body.genreId);
    if (genre === undefined) return res.status(400).send('Invalid genre');

    // update to database and check the results
    if (!await updateMovie(Movie, req)) res.status(404).send('The movie with the given ID was not found.');
    else res.send('Update movie successful.');
});

// DELETE remove movie from database
router.delete('/:id', [auth, admin], async(req, res) => {
    // delete from database and check the results 
    if (!await deleteMovie(Movie, req)) res.status(404).send('The movie with the given ID was not found.');
    else res.send('Delete movie successful.');
});

module.exports = router;