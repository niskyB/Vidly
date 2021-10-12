const express = require('express');
const router = express.Router();
const { connect } = require('../utils/dbConnector');
const { Genre } = require('../models/genre');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, async(req, res) => {
    connect(req, res, 'SELECT * FROM ??', [Genre.dbName],
        function(error, results, fields) {
            if (error) res.status(500).send('Something went wrong.');
            else {
                if (results[0] === undefined) res.status(404).send('The genre list is empty.');
                else res.send(results);
            }
        });
});

router.get('/:id', auth, async(req, res) => {
    connect(req, res, 'SELECT * FROM ?? WHERE ?? = ?', [Genre.dbName, "genreId", req.params.id],
        function(error, results, fields) {
            if (error) res.status(500).send('Something went wrong.');
            else {
                if (results[0] === undefined) res.status(404).send('The genre with the given ID was not found.');
                else res.send(results[0]);
            }
        });
});

router.post('/', auth, async(req, res) => {
    const error = Genre.validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genreId = uuidv4().substr(1, Genre.idLength);
    connect(req, res, "INSERT INTO ??(genreId, genreName) VALUES(?, ?)", [Genre.dbName, genreId, req.body.genreName],
        function(error, results, fields) {
            if (error) res.status(500).send('Something went wrong.');
            else {
                if (results.affectedRows === 0) res.status(500).send('Something was wrong.');
                else res.send('Add genre successful.');
            }
        });
});

router.put('/:id', [auth, admin], async(req, res) => {
    const error = Genre.validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    connect(req, res, "UPDATE ?? SET genreName = ? WHERE genreId = ?", [Genre.dbName, req.body.genreName, req.params.id],
        function(error, results, fields) {
            if (error) res.status(500).send('Something went wrong.');
            else {
                if (results.affectedRows === 0) res.status(404).send('The genre with the given ID was not found.');
                else res.send('Update genre successful.');
            }
        });
});

router.delete('/:id', [auth, admin], async(req, res) => {
    connect(req, res, "DELETE FROM ?? WHERE genreId = ?", [Genre.dbName, req.params.id],
        function(error, results, fields) {
            if (error) res.status(500).send('Something went wrong.');
            else {
                if (results.affectedRows === 0) res.status(404).send('The genre with the given ID was not found.');
                else res.send('Delete genre successful.');
            }
        });
});

module.exports = router;