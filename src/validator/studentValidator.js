import joi from 'joi';


const  passwordCharsValidator = (value,helpers) =>{
    const uniqueChars = new Set(value);
    if(value.length !== uniqueChars.size) {
        return helpers.message("Passwords must not contain  repeated characters");
    }
    return value
}

export const addStudentSchema = joi.object({

    id:joi.number().integer().positive().required(),
    name:joi.string().required(),
    password:joi.string().min(6).required().custom(passwordCharsValidator).message({
        'string.base':'The field must be a string',
        'string.empty':'The password must not be empty'
    }),

})

export const updateStudentSchema = joi.object({
    name:joi.string(),
    password:joi.string(),
})
export const ScoreSchema = joi.object({
    examName:joi.string().required(),
    score:joi.number().integer().min(0).max(100).required(),
})