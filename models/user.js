const Joi = require('joi');

class User {
    static idLength = 20;
    static dbName = "vidly_user";

    constructor(userId, username, email, password, isAdmin) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
    }

    static validateUser(user) {
        const schema = Joi.object({
            username: Joi.string().min(3).max(50).trim().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(50).trim().required(),
            isAdmin: Joi.number().min(0).max(1).required()
        });

        const { error } = schema.validate(user);
        return error;
    }
}

exports.User = User;