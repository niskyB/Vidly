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
        try {
            if (err) throw new Error('Cannot connect to database.');
            // Check existed customer
            let results = await promisePool.query(`SELECT * FROM ?? WHERE ?? = ?`, [Customer.dbName, "customerId", req.body.customerId]);
            if (results[0].length === 0) throw new Error('Invalid customer.');
            // Check existed movie and quantity in stock
            results = await promisePool.query('SELECT * FROM ?? WHERE ?? = ?', [Movie.dbName, "movieId", req.body.movieId]);
            if (results[0].length === 0) throw new Error('Invalid movie.');
            if (results[0][0].numberInStock === 0) throw new Error('Movie is not in stock.');
            // Begin transaction
            connection.beginTransaction(function(err) {
                if (err) throw new Error('Begin transaction fail.');
                connection.query('UPDATE ?? SET numberInStock = ? WHERE movieId = ?', [Movie.dbName, results[0][0].numberInStock - 1, req.body.movieId],
                    function(error, results, fields) {
                        if (error) {
                            return connection.rollback(function() {
                                throw error;
                            });
                        }

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
            });
        } catch (err) {
            if (err.message.includes('Invalid')) res.status(404).send(err.message);
            else if (err.message.includes('stock')) res.status(400).send(err.message);
            else res.status(500).send(err.message);
        }
        connection.release();
    });
});

module.exports = router;