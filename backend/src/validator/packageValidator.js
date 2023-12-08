const Joi = require('@hapi/joi');

const CreatePackageValidation = Joi.object({
    title: Joi.string().required().min(10).max(100).required(),
    overview: Joi.string().min(20).required(),
    whatsIncluded: Joi.string().min(10).required(),
    tourItinerary: Joi.string().required(),
    price: Joi.number().required().positive(),
    duration: Joi.number().required().positive(),
    images: Joi.array().items(Joi.string()).required(),
    locations: Joi.array().items(Joi.string()),

});

const UpdatePackageValidation = Joi.object({
    title: Joi.string().min(10).max(100),
    overview: Joi.string().min(20),
    whatsIncluded: Joi.string().min(10),
    tourItinerary: Joi.string(),
    price: Joi.number().positive(),
    duration: Joi.number().positive(),
    images: Joi.array().items(Joi.string()),
    locations: Joi.array().items(Joi.string()),
    isApproved: Joi.boolean(),
    isDeleted: Joi.boolean()
});


module.exports = {
    CreatePackageValidation,
    UpdatePackageValidation
};