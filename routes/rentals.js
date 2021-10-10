const express = require('express');
const router = express.Router();
const { connect, pool, promisePool } = require('../utils/dbConnector');
const { Rental } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
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
    const error = Rental.validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    pool.getConnection(async function(err, connection) {
        if (err) res.status(500).send('Something went wrong.');
        // Use the connection
        else {
            let results = await promisePool.query(`SELECT * FROM ?? WHERE ?? = ?`, [Customer.dbName, "customerId", req.body.customerId]);
            if (results[0].length === 0) res.status(404).send('Invalid customer.');
            else {
                results = await promisePool.query('SELECT * FROM ?? WHERE ?? = ?', [Movie.dbName, "movieId", req.body.movieId]);
                if (results[0].length === 0) res.status(404).send('Invalid movie.');
                else if (results[0][0].numberInStock === 0) res.status(400).send('Movie is not in stock.');
                else {
                    connection.beginTransaction(function(err) {
                        if (err) res.status(500).send('Something went wrong.');
                        else {
                            connection.query('UPDATE ?? SET numberInStock = ? WHERE movieId = ?', [Movie.dbName, results[0][0].numberInStock - 1, req.body.movieId],
                                function(error, results, fields) {
                                    if (error) {
                                        return connection.rollback(function() {
                                            throw error;
                                        });
                                    }

                                    const log = 'Post ' + results.insertId + ' added';
                                    const rentalId = uuidv4().substr(1, Movie.idLength);

                                    connection.query('INSERT INTO ??(rentalId, customerId, movieId) VALUES(?, ?, ?)', [Rental.dbName, rentalId, req.body.customerId, req.body.movieId],
                                        function(error, results, fields) {
                                            if (error) {
                                                return connection.rollback(function() {
                                                    throw error;
                                                });
                                            }
                                            connection.commit(function(err) {
                                                if (err) {
                                                    return connection.rollback(function() {
                                                        throw err;
                                                    });
                                                }
                                                res.send('Add rental successful!');
                                            });
                                        });
                                });
                        }
                    });
                }
            }
        }
        connection.release();
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