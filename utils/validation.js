const Joi = require("joi");

module.exports = {
    loginSchema : Joi.object({
        email: Joi.string().required().trim(),
        password: Joi.string().required()
    }),
    emailSchema : Joi.object({
        email: Joi.string().required().trim().email()
    }),
    signupSchema : Joi.object({
        name: Joi.string().required().min(2).max(50),
        email: Joi.string().required().trim().email(),
        password: Joi.string().required().min(6),
        otp: Joi.string().required().length(6)
    }),
    // Needs to be changed - not working
    createQuesion : Joi.object({
        text: Joi.string().required().trim(),
        options: Joi.array().min(2).max(4).required().items(Joi.object({
            option: Joi.string().required().trim(),
            isRight: Joi.boolean().required(),
        })),
    }),
    // Needs to be changed - not working
    updateQuestion : Joi.object({
        text: Joi.string().trim(),
        options: Joi.array().min(2).max(4).required().items(Joi.object({
            option: Joi.string().required().trim(),
            isRight: Joi.boolean().required(),
        })),
    }),
    createQuiz : Joi.object({
        title: Joi.string().required().trim().min(1).max(15),
        maxQuestions: Joi.number().required().min(5).max(25),
    }),
    addQuizQuestion : Joi.object({
        quesId: Joi.string().required(),
        time: Joi.number().required().min(5).max(120),
        points: Joi.number().required().min(0).max(100),
    }),
    removeQuizQuestion : Joi.object({
        quesId: Joi.string().required()
    }),
    updateQuizQuestion : Joi.object({
        time: Joi.number().required().min(5).max(120),
        points: Joi.number().required().min(0).max(100),
    }),
}