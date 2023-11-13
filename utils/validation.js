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
    createQuesion : Joi.object({
        text: Joi.string().required().trim(),
        options: Joi.array().min(2).max(4).required().items(Joi.string().required().trim()),
        answerIndex: Joi.number().required().min(0).max(3),
    }),
    createQuiz : Joi.object({
        name: Joi.string().required().trim(),
        questions: Joi.array().items(Joi.object({
            question: Joi.string().required().trim(),
            time: Joi.number().required().min(1).max(120),
            points: Joi.number().required().min(0).max(100),
        })).required(),
    }),
}