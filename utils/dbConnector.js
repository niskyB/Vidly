const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '0410',
    database: 'vidly'
});

function connect(req, res, query, param, callback) {
    pool.getConnection(function(err, connection) {
        if (err) res.status(500).send('Something went wrong.');
        // Use the connection
        else {
            connection.query(query, param, callback);
        }
        connection.release();
    });
}



exports.connect = connect;