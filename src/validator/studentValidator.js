import joi from 'joi';


export const addStudentSchema = joi.object({

    id:joi.number().integer().positive().required(),
    name:joi.string().required(),
    password:joi.string().length(6).required(),

})

export const updateStudentSchema = joi.object({
    name:joi.string(),
    password:joi.string(),
})
export const ScoreSchema = joi.object({
    examName:joi.string().required(),
    score:joi.number().integer().min(0).max(100).required(),
})