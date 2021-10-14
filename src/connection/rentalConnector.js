const { pool, promisePool } = require('../connection/dbConnector');
const { getCustomerById } = require('./customerConnector');
const { getMovieById } = require('./movieConnector');
const { v4: uuidv4 } = require('uuid');

async function getRentalList(Rental) {
    const results = await promisePool.query('SELECT * FROM ??', [Rental.dbName]);
    return results[0];
}

async function getRentalById(Rental, req) {
    const results = await promisePool.query('SELECT * FROM ?? WHERE ?? = ?', [Rental.dbName, "rentalId", req.params.id]);
    return results[0][0];
}

async function createRental(Rental, req, Customer, Movie, res) {
    pool.getConnection(async function(err, connection) {
        try {
            if (err) throw new Error('Cannot connect to database.');
            // Check existed customer
            let results = await getCustomerById(Customer, req.body.customerId);
            if (results === undefined) throw new Error('Invalid customer.');

            // Check existed movie and quantity in stock
            results = await getMovieById(Movie, req.body.movieId);
            if (results === undefined) throw new Error('Invalid movie.');
            if (results.numberInStock === 0) throw new Error('Movie is not in stock.');

            // Begin transaction
            connection.beginTransaction(function(err) {
                if (err) throw new Error('Begin transaction fail.');
                connection.query('UPDATE ?? SET numberInStock = ? WHERE movieId = ?', [Movie.dbName, results.numberInStock - 1, req.body.movieId],
                    function(error, results, fields) {
                        if (error) {
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                        // generate rentalId
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
}

exports.getRentalList = getRentalList;
exports.getRentalById = getRentalById;
exports.createRental = createRental;