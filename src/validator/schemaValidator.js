const Joi = require('@hapi/joi');

const UserSignupValidation = Joi.object({
    username: Joi.string().required()
        .min(6) // Minimum length for the username
        .max(30) // Maximum length for the username
        .regex(/^[a-zA-Z\s]+$/, 'Alphabetic characters and spaces only'), // Allow alphabetic characters and spaces

    email: Joi.string().email().lowercase().required(),

    password: Joi.string().min(8).required()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%^&*])"), 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'),

    phone: Joi.string().required()
        .pattern(/^\d{11}$/, 'Phone number must be exactly 10 digits')
});

const UserLoginValidation = Joi.object({
    email: Joi.string().email().lowercase().required(),

    password: Joi.string().min(8).required()
});

const UserUpdateProfileValidation = Joi.object({
    username: Joi.string().min(6).max(30).regex(/^[a-zA-Z\s]+$/, 'Alphabetic characters and spaces only'),
    email: Joi.string().email().lowercase(),
    password: Joi.string().min(8)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%^&*])"), 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'),
    phone: Joi.string().pattern(/^\d{11}$/),
    favourite: Joi.string(),
    remove_favourite: Joi.string(),
    role: Joi.string()
});

const AgentSignupValidation = Joi.object({
    name: Joi.string().required()
        .min(6)
        .max(30)
        .regex(/^[a-zA-Z\s]+$/, 'Alphabetic characters and spaces only'),
    phone: Joi.string().pattern(/^\d{11}$/).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%^&*])"), 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'),
    cnic_image: Joi.string().required(),
    license_image: Joi.string().required(),


});

const AgentLoginValidation = Joi.object({
    email: Joi.string().email().lowercase().required(),

    password: Joi.string().min(8).required()
});

const AgentUpdateValidation = Joi.object({
    name: Joi.string()
        .min(6)
        .max(30)
        .regex(/^[a-zA-Z\s]+$/, 'Alphabetic characters and spaces only'),
    phone: Joi.string().pattern(/^\d{11}$/),
    email: Joi.string().email().lowercase(),
    password: Joi.string().min(8)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%^&*])"), 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'),
    cnic_image: Joi.string(),
    license_image: Joi.string(),
});

module.exports = {
    UserSignupValidation,
    UserLoginValidation,
    UserUpdateProfileValidation,
    AgentSignupValidation,
    AgentLoginValidation,
    AgentUpdateValidation
};
