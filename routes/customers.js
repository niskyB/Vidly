const express = require('express');
const router = express.Router();
const { pool } = require('../utils/dbConnector');
const { Customer } = require('../models/customer');

router.get('/', async(req, res) => {
    pool.getConnection(function(err, connection) {
        if (err) {
            console.error(error);
            connection.release();
            return;
        }
        // Use the connection
        connection.query('SELECT * FROM vidly_customer', function(error, results, fields) {
            if (error) throw error;
            res.send(results[0]);
            connection.release();
        });
    });
});

router.get('/:id', async(req, res) => {

});

router.post('/', async(req, res) => {

});

router.put('/:id', async(req, res) => {

});

router.delete('/:id', async(req, res) => {

});