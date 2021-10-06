const Joi = require('joi');

class Customer {
    idLength = 20;

    constructor(customerId, fullName, phone, isGold) {
        this.customerId = customerId;
        this.fullName = fullName;
        this.phone = phone;
        this.isGold = isGold;
    }
}

function validateCustomer(customer) {
    const schema = Joi.object({
        fullName: Joi.string().min(3).max(50).trim().required(),
        phone: Joi.string().min(5).max(20).trim().pattern(/^[0-9]+$/).required(),
        isGold: Joi.boolean().required()
    });

    const { error } = schema.validate(customer);
    return error;
}

exports.Customer = Customer;
exports.validate = validateCustomer;