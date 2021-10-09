const Joi = require('joi');

class Rental {
    static idLength = 20;
    static dbName = "vidly_rental";

    constructor(rentalId, customerId, movieId) {
        this.rentalId = rentalId;
        this.customerId = customerId;
        this.movieId = movieId;
    }

    static validateRental(rental) {
        const schema = Joi.object({
            customerId: Joi.string().required(),
            movieId: Joi.string().required()
        });

        const { error } = schema.validate(rental);
        return error;
    }
}

exports.Rental = Rental;