const Joi = require('@hapi/joi');

const CreatePackageValidation = Joi.object({
    title: Joi.string().required().min(10).max(100).required(),
    overview: Joi.string().min(20).required(),
    whatsIncluded: Joi.string().min(10).required(),
    tourItinerary: Joi.string().required(),
    price: Joi.number().required().positive(),
    duration: Joi.number().required().positive(),
    images: Joi.array().items(Joi.string()).required(),
    maxPersons: Joi.number().required().positive(),
    locations: Joi.array().items(Joi.string()),

});

const UpdatePackageValidation = Joi.object({
    _id: Joi.string(),
    title: Joi.string().min(10).max(100),
    overview: Joi.string().min(20),
    whatsIncluded: Joi.string().min(10),
    tourItinerary: Joi.string(),
    price: Joi.number().positive(),
    duration: Joi.number().positive(),
    images: Joi.array().items(Joi.string()),
    locations: Joi.array().items(Joi.string()),
    maxPersons: Joi.number().positive(),
    isApproved: Joi.boolean(),
    isDeleted: Joi.boolean(),
    agentId: Joi.object({
        _id: Joi.string(),
        phone: Joi.string(),
        email: Joi.string(),
    }),
    __v: Joi.number()
});


module.exports = {
    CreatePackageValidation,
    UpdatePackageValidation
};