const Joi = require('@hapi/joi');

const CreateBookingValidation = Joi.object({
    package_id: Joi.string().required(),
    departure_date: Joi.date().iso().required(),
    no_of_persons: Joi.number().integer().min(1).required(),
    no_of_infants: Joi.number().integer().min(0).required(),
    price: Joi.number().required(),
});

const UpdateBookingValidation = Joi.object({
    user_id: Joi.string(),
    package_id: Joi.string(),
    agent_id: Joi.string(),
    departure_date: Joi.date().iso(),
    no_of_persons: Joi.number().integer().min(1),
    no_of_infants: Joi.number().integer().min(0),
    status: Joi.string(),
});

module.exports = {
    CreateBookingValidation,
    UpdateBookingValidation,
};
