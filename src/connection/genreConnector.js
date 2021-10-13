const { promisePool } = require('../connection/dbConnector');

async function getGenreList(Genre) {
    const results = await promisePool.query('SELECT * FROM ??', [Genre.dbName]);
    return results[0];
}

async function getGenreById(Genre, req) {
    const results = await promisePool.query('SELECT * FROM ?? WHERE ?? = ?', [Genre.dbName, "genreId", req.params.id]);
    return results[0][0];
}

async function createGenre(Genre, req, genreId) {
    await promisePool.query("INSERT INTO ??(genreId, genreName) VALUES(?, ?)", [Genre.dbName, genreId, req.body.genreName]);
}

async function updateGenre(Genre, req) {
    const results = await promisePool.query("UPDATE ?? SET genreName = ? WHERE genreId = ?", [Genre.dbName, req.body.genreName, req.params.id]);
    if (results[0].affectedRows === 0) return false;
    return true;
}

async function deleteGenre(Genre, req) {
    const results = await promisePool.query("DELETE FROM ?? WHERE genreId = ?", [Genre.dbName, req.params.id]);
    if (results[0].affectedRows === 0) return false;
    return true;
}

exports.getGenreList = getGenreList;
exports.getGenreById = getGenreById;
exports.createGenre = createGenre;
exports.updateGenre = updateGenre;
exports.deleteGenre = deleteGenre;