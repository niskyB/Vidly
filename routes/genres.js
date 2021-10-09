const express = require('express');
const router = express.Router();
const { connect } = require('../utils/dbConnector');
const { Genre } = require('../models/genre');
const { v4: uuidv4 } = require('uuid');

router.get('/', async(req, res) => {

});

router.get('/:id', async(req, res) => {

});

router.post('/', async(req, res) => {

});

router.put('/:id', async(req, res) => {

});

router.delete('/:id', async(req, res) => {

});

module.exports = router;