const Joi = require('joi');

class Rental {
    idLength = 20;

    constructor(rentalId, customerId, movieId) {
        this.rentalId = rentalId;
        this.customerId = customerId;
        this.movieId = movieId;
    }
}

function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
    });

    const { error } = schema.validate(rental);
    return error;
}

exports.Rental = Rental;
exports.validate = validateRental;