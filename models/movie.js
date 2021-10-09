const Joi = require('joi');

class Movie {
    static idLength = 20;
    static dbName = "vidly_movie";

    constructor(movieId, title, numberInStock, dailyRentalRate, genreId) {
        this.movieId = movieId;
        this.title = title;
        this.numberInStock = numberInStock;
        this.dailyRentalRate = dailyRentalRate;
        this.genreId = genreId;
    }

    static validateGenre(genre) {
        const schema = Joi.object({
            title: Joi.string().min(3).max(50).trim().required(),
            numberInStock: Joi.number().min(0).required(),
            dailyRentalRate: Joi.number().min(0).required(),
            genreId: Joi.string().required()
        });

        const { error } = schema.validate(genre);
        return error;
    }
}

exports.Movie = Movie;