const { pool } = require('./utils/dbConnector');

pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

    // Use the connection
    connection.query('SELECT * FROM vidly_customer', function(error, results, fields) {
        // When done with the connection, release it.

        console.log(results[0]);
        // Handle error after the release.
        if (error) throw error;

        // Don't use the connection here, it has been returned to the pool.
    });
});