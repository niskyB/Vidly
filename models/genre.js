const Joi = require('joi');

class Genre {
    static idLength = 20;

    constructor(genreName) {
        this.genreName = genreName;
    }
}

function validateGenre(genre) {
    const schema = Joi.object({
        genreName: Joi.string().trim().min(3).max(50).required()
    });

    const { error } = schema.validate(genre);
    return error;
}

exports.Genre = Genre;
exports.validate = validateGenre;