const Joi = require('joi');

class Customer {
    static idLength = 20;
    static dbName = vidly_customer;

    constructor(customerId, customerName, phone, isGold) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.phone = phone;
        this.isGold = isGold;
    }

    validateCustomer(customer) {
        const schema = Joi.object({
            customerName: Joi.string().min(3).max(50).trim().required(),
            phone: Joi.string().min(5).max(20).pattern(/^[0-9]+$/).required(),
            isGold: Joi.number().min(0).max(1).required()
        });
        const { error } = schema.validate(customer);
        return error;
    }
}

exports.Customer = Customer;