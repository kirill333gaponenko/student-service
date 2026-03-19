import joi from 'joi';


export const addStudentSchema = joi.object({

    id:joi.number().integer().required(),
    name:joi.string().required(),
    password:joi.string().required(),

})

export const updateStudentSchema = joi.object({
    name:joi.string(),
    password:joi.string(),
})
export const ScoreSchema = joi.object({
    examName:joi.string().required(),
    score:joi.number().integer().min(0).max(100).required(),
})