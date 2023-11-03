const Joi = require('@hapi/joi');

const CreatePackageValidation = Joi.object({
    title: Joi.string().required().min(10).max(100).required(), // Adjust the min and max lengths as needed
    overview: Joi.string().min(20).required(),
    whatsIncluded: Joi.string().min(10).required(),
    tourItinerary: Joi.string().required(),
    price: Joi.number().required().positive(), // Assuming the price should be a positive number
    duration: Joi.number().required().positive(), // Assuming the duration should be a positive number
    images: Joi.array().items(Joi.string()).required(), // Assuming images are optional or an array of strings
    locationTags: Joi.array().items(Joi.string()), // Assuming locationTags are optional or an array of strings

});


module.exports = {
    CreatePackageValidation
};