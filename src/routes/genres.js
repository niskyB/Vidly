const express = require('express');
const router = express.Router();
const { promisePool } = require('../connection/dbConnector');
const { Genre } = require('../models/genre');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET get genre list
router.get('/', auth, async(req, res) => {
    // query data
    const results = await promisePool.query('SELECT * FROM ??', [Genre.dbName]);

    // check the results
    if (results[0].length === 0) res.status(404).send('The genre list is empty.');
    else res.send(results[0]);
});

// GET get genre by given id
router.get('/:id', auth, async(req, res) => {
    // query data
    const results = await promisePool.query('SELECT * FROM ?? WHERE ?? = ?', [Genre.dbName, "genreId", req.params.id]);

    // check the results
    if (results[0].length === 0) res.status(404).send('The genre with the given ID was not found.');
    else res.send(results[0][0]);
});

// POST create a new genre and save to database
router.post('/', auth, async(req, res) => {
    // check request body
    const error = Genre.validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // generate genreId
    const genreId = uuidv4().substr(1, Genre.idLength);

    // insert into database
    await promisePool.query("INSERT INTO ??(genreId, genreName) VALUES(?, ?)", [Genre.dbName, genreId, req.body.genreName]);
    res.send('Add genre successful.');
});

// PUT update genre's information
router.put('/:id', [auth, admin], async(req, res) => {
    // check request body
    const error = Genre.validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // update to database
    const results = await promisePool.query("UPDATE ?? SET genreName = ? WHERE genreId = ?", [Genre.dbName, req.body.genreName, req.params.id]);

    // check the results
    if (results[0].affectedRows === 0) res.status(404).send('The genre with the given ID was not found.');
    else res.send('Update genre successful.');
});

// DELETE remove genre from database
router.delete('/:id', [auth, admin], async(req, res) => {
    // delete from database
    const results = await promisePool.query("DELETE FROM ?? WHERE genreId = ?", [Genre.dbName, req.params.id]);

    // check the results
    if (results[0].affectedRows === 0) res.status(404).send('The genre with the given ID was not found.');
    else res.send('Delete genre successful.');
});

module.exports = router;