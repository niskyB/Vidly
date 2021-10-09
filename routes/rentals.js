const express = require('express');
const router = express.Router();
const { connect } = require('../utils/dbConnector');
const { Rental } = require('../models/rental');
const { v4: uuidv4 } = require('uuid');

router.get('/', async(req, res) => {
    connect(req, res, 'SELECT * FROM ??', [Rental.dbName],
        function(error, results, fields) {
            if (error) res.status(500).send('Something went wrong.');
            else {
                if (results[0] === undefined) res.status(404).send('The rental list is empty.');
                else res.send(results);
            }
        });
});

router.get('/:id', async(req, res) => {
    connect(req, res, 'SELECT * FROM ?? WHERE ?? = ?', [Rental.dbName, "rentalId", req.params.id],
        function(error, results, fields) {
            if (error) res.status(500).send('Something went wrong.');
            else {
                if (results[0] === undefined) res.status(404).send('The rental with the given ID was not found.');
                else res.send(results[0]);
            }
        });
});

router.post('/', async(req, res) => {
    const error = Genre.validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const rentalId = uuidv4().substr(1, Rental.idLength);
    connect(req, res, "INSERT INTO ??(rentalId, genreName) VALUES(?, ?)", [Genre.dbName, genreId, req.body.genreName],
        function(error, results, fields) {
            if (error) res.status(500).send('Something went wrong.');
            else {
                if (results.affectedRows === 0) res.status(500).send('Something was wrong.');
                else res.send('Add genre successful.');
            }
        });
});

router.put('/:id', async(req, res) => {
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

router.delete('/:id', async(req, res) => {
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