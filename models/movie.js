const Joi = require('joi');

class Movie {
    static idLength = 20;

    constructor(movieId, title, genreId, numberInStock, dailyRentalRate) {
        this.movieId = movieId;
        this.title = title;
        this.genreId = genreId;
        this.numberInStock = numberInStock;
        this.dailyRentalRate = dailyRentalRate;
    }
}

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(50).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0).max(250).required(),
        dailyRentalRate: Joi.number().min(0).max(250).required()
    });

    const { error } = schema.validate(movie);
    return error;
}

exports.Movie = Movie;
exports.validate = validateMovie;