const express = require('express');
const router = express.Router();
const { Genre } = require('../models/genre');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { getGenreList, getGenreById, createGenre, updateGenre, deleteGenre } = require('../connection/genreConnector');

// GET get genre list
router.get('/', auth, async(req, res) => {
    // query data
    const genres = await getGenreList(Genre);

    // check the results
    if (genres.length === 0) res.status(404).send('The genre list is empty.');
    else res.send(genres);
});

// GET get genre by given id
router.get('/:id', auth, async(req, res) => {
    // query data
    const genre = await getGenreById(Genre, req);

    // check the result
    if (genre === undefined) res.status(404).send('The genre with the given ID was not found.');
    else res.send(genre);
});

// POST create a new genre and save to database
router.post('/', auth, async(req, res) => {
    // check request body
    const error = Genre.validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // generate genreId
    const genreId = uuidv4().substr(1, Genre.idLength);

    // insert into database
    await createGenre(Genre, req, genreId);
    res.send('Add genre successful.');
});

// PUT update genre's information
router.put('/:id', [auth, admin], async(req, res) => {
    // check request body
    const error = Genre.validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // update to database and check the result 
    if (!await updateGenre(Genre, req)) res.status(404).send('The genre with the given ID was not found.');
    else res.send('Update genre successful.');
});

// DELETE remove genre from database
router.delete('/:id', [auth, admin], async(req, res) => {
    // delete from database and check the result
    if (!await deleteGenre(Genre, req)) res.status(404).send('The genre with the given ID was not found.');
    else res.send('Delete genre successful.');
});

module.exports = router;