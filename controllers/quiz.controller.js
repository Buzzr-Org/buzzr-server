const {Quiz, Question, GameSession} = require("../models");
const {ErrorHandler} = require("../middleware/errors");
const jv = require("../utils/validation");
const asyncWrapper = require("../utils/asyncWrapper");

module.exports = {
    createQuestion : asyncWrapper(async (req, res) => {
        const body = jv.createQuesion(req.body);
        const {text, options, answerIndex} = body;

        const question = await Question.create({
            text,
            options,
            answerIndex
        });

        const data = {
            question
        }

        return res.status(200).json({success:true, message:"Question Created Successfully",data});
    }),
    updateQuestion : asyncWrapper(async (req, res) => {

    }),
    createQuiz : asyncWrapper(async (req, res) => {
        const body = jv.createQuiz(req.body);
        const {name, questions} = body;

        const user = req.user;

        const quiz = await Quiz.create({
            name,
            questions,
            createdBy: user._id
        });

        const data = {
            quiz
        }

        return res.status(200).json({success:true, message:"Quiz Created Successfully",data});
    }),
}