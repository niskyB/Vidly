const { promisePool } = require('../connection/dbConnector');

async function getMovieList(Movie) {
    const results = await promisePool.query('SELECT * FROM ??', [Movie.dbName]);
    return results[0];
}

async function getMovieById(Movie, movieId) {
    const results = await promisePool.query('SELECT * FROM ?? WHERE ?? = ?', [Movie.dbName, "movieId", movieId]);
    return results[0][0];
}

async function createMovie(Movie, req, movieId) {
    await promisePool.query("INSERT INTO ??(movieId, title, numberInStock, dailyRentalRate, genreId) VALUES(?, ?, ?, ?, ?)", [Movie.dbName, movieId, req.body.title, req.body.numberInStock, req.body.dailyRentalRate, req.body.genreId]);
}

async function updateMovie(Movie, req) {
    const results = await promisePool.query("UPDATE ?? SET title = ?, numberInStock = ?, dailyRentalRate = ?, genreId = ? WHERE movieId = ?", [Movie.dbName, req.body.title, req.body.numberInStock, req.body.dailyRentalRate, req.body.genreId, req.params.id]);
    if (results[0].affectedRows === 0) return false;
    return true;
}

async function deleteMovie(Movie, req) {
    const results = await promisePool.query("DELETE FROM ?? WHERE movieId = ?", [Movie.dbName, req.params.id]);
    if (results[0].affectedRows === 0) return false;
    return true;
}

exports.getMovieList = getMovieList;
exports.getMovieById = getMovieById;
exports.createMovie = createMovie;
exports.updateMovie = updateMovie;
exports.deleteMovie = deleteMovie;