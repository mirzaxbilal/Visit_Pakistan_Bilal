const Joi = require('@hapi/joi')

const signupSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required()
    //test
})

const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),

    password: Joi.string().min(8).required()
})

module.exports = {
    signupSchema,
    loginSchema
}
