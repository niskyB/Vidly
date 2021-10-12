const Joi = require('joi');

class Genre {
    static idLength = 20;
    static dbName = "vidly_genre";

    constructor(genreId, genreName) {
        this.genreId = genreId;
        this.genreName = genreName;
    }

    static validateGenre(genre) {
        const schema = Joi.object({
            genreName: Joi.string().min(3).max(50).trim().required()
        });

        const { error } = schema.validate(genre);
        return error;
    }
}

exports.Genre = Genre;