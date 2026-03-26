import Joi from 'joi';

const passwordCharsValidator = (value, helpers) => {
    const uniqueChars = new Set(value);
    if (value.length !== uniqueChars.size) {
        return helpers.message("Passwords must not contain repeated characters");
    }
    return value;
}

export const addStudentSchema = Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.string().required(),
    password: Joi.string().required().custom(passwordCharsValidator).messages({
        'string.base': 'The field must be a string',
        'string.empty': 'The password must not be empty',

    }),
})

export const updateStudentSchema = Joi.object({
    name: Joi.string(),
    password: Joi.string().custom(passwordCharsValidator)
})

export const scoreSchema = Joi.object({
    examName: Joi.string().required(),
    score: Joi.number().integer().min(0).max(100).required()
})