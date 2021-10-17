const express = require('express');
const router = express.Router();
const { Genre } = require('../models/genre');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { getGenreList, getGenreById, createGenre, updateGenre, deleteGenre } = require('../connection/genreConnector');
const { getResponseForm } = require('../utils/helper');
const status = require('../constants/status');

// GET get genre by given id
router.get('/:id', auth, async(req, res) => {
    // query data
    const genre = await getGenreById(Genre, req.params.id);

    // check the result
    if (genre === undefined) res.status(status.NOT_FOUND).send(getResponseForm(null, null, 'The genre with the given ID was not found.'));
    else res.send(getResponseForm(genre, null, 'Get genre with the given ID successful.'));
});

// GET get genre list
router.get('/', auth, async(req, res) => {
    // query data
    const genres = await getGenreList(Genre);

    // check the results
    if (genres.length === 0) res.status(status.NOT_FOUND).send(getResponseForm(null, null, 'The genre list is empty.'));
    else res.send(genres);
});

// POST create a new genre and save to database
router.post('/', auth, async(req, res) => {
    // check request body
    const error = Genre.validateGenre(req.body);
    if (error) return res.status(status.BAD_REQUEST).send(getResponseForm(null, error, "Invalid params"));

    // generate genreId
    const genreId = uuidv4().substr(1, Genre.idLength);

    // insert into database
    await createGenre(Genre, req, genreId);
    res.send(getResponseForm(null, null, 'Add genre successful.'));
});

// PUT update genre's information
router.put('/:id', [auth, admin], async(req, res) => {
    // check request body
    const error = Genre.validateGenre(req.body);
    if (error) return res.status(status.BAD_REQUEST).send(getResponseForm(null, error, "Invalid params"));

    // update to database and check the result 
    if (!await updateGenre(Genre, req)) res.status(status.NOT_FOUND).send(getResponseForm(null, null, 'The genre with the given ID was not found.'));
    else res.send(getResponseForm(null, null, 'Update genre successful.'));
});

// DELETE remove genre from database
router.delete('/:id', [auth, admin], async(req, res) => {
    // delete from database and check the result
    if (!await deleteGenre(Genre, req)) res.status(status.NOT_FOUND).send(getResponseForm(null, null, 'The genre with the given ID was not found.'));
    else res.send(getResponseForm(null, null, 'Delete genre successful.'));
});

module.exports = router;