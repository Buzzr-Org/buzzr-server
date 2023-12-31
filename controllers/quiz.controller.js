const cloudinary = require('cloudinary').v2;
const {Quiz, Question} = require("../models");
const {ErrorHandler} = require("../middleware/errors");
const jv = require("../utils/validation");
const asyncWrapper = require("../utils/asyncWrapper");
const {removeQuestionFromQuizzes} = require("../utils/functions");

module.exports = {
    createQuestion : asyncWrapper(async (req, res, next) => {
        const body = await jv.createQuesion.validateAsync(req.body);
        let {text, options} = body;
        options = JSON.parse(options);
        let file = req.files ? req.files.file : null;
        let link = null, type = "none";
        if(file){
            const result = await cloudinary.uploader.upload(file.tempFilePath,{
                public_id: `${Math.floor(Date.now()/100)}`,
                resource_type:'auto',
                folder:'images'
            });
            type = result.resource_type;
            link = result.secure_url;
        }
        const question = await Question.create({
            text,
            options,
            createdBy: req.user._id,
            media: {
                link,
                type
            }
        });
        const data = {
            question
        }
        return res.status(200).json({success:true, message:"Question Created Successfully",data});
    }),
    updateQuestion : asyncWrapper(async (req, res, next) => {
        const body = await jv.updateQuestion.validateAsync(req.body);
        const quesId = req.params.quesId;
        const ques = await  Question.findById(quesId);
        if(!ques)
            return next(new ErrorHandler(404,"Question Not Found"));
        const user = req.user;
        if(ques.createdBy!=user._id)
            return next(new ErrorHandler(401,"Unauthorized"));
        ques = body;
        const updatedQues = await ques.save();
        const data = {
            question: updatedQues
        }
        return res.status(200).json({success:true, message:"Question Updated Successfully",data});
    }),
    deleteQuestion : asyncWrapper(async (req, res, next) => {
        const quesId = req.params.quesId;
        const ques = await Question.findByIdAndDelete(quesId);
        if(!ques)
            return next(new ErrorHandler(404,"Question Not Found"));
        const user = req.user;
        if(ques.createdBy.toString()!=user._id.toString())
            return next(new ErrorHandler(401,"Unauthorized"));
        if(ques.media.type!="none"){
            const imgNum = ques.media.link.split("/")[8].split(".")[0];
            cloudinary.uploader.destroy(`images/${imgNum}`);
        }
        removeQuestionFromQuizzes(quesId);
        const data = {
            question: ques
        }
        return res.status(200).json({success:true, message:"Question Deleted Successfully",data});
    }),
    createQuiz : asyncWrapper(async (req, res, next) => {
        const body = await jv.createQuiz.validateAsync(req.body);
        const {title,maxQuestions} = body;
        const user = req.user;
        const quiz = await Quiz.create({
            title,
            maxQuestions,
            createdBy: user._id
        });
        const data = {
            quiz
        }
        return res.status(200).json({success:true, message:"Quiz Created Successfully",data});
    }),
    removeQuizQuestion: asyncWrapper(async (req, res, next) => {
        const body = await jv.removeQuizQuestion.validateAsync(req.body);
        const quizId = req.params.quizId;
        const quesId = body.quesId;
        const quiz = await Quiz.findById(quizId);
        if(!quiz)
            return next(new ErrorHandler(404,"Quiz Not Found"));
        quiz.questions = quiz.questions.filter(ques => ques.question!=quesId);
        const updatedQuiz = await quiz.save();
        const data = {
            quiz: updatedQuiz
        }
        return res.status(200).json({success:true, message:"Question Removed Successfully from Quiz",data});
    }),
    addQuizQuestion: asyncWrapper(async (req, res, next) => {
        const body = req.body;
        const quizId = req.params.quizId;
        const {quesId,time=20,points=10} = body;
        const quiz = await Quiz.findById(quizId);
        if(!quiz)
            return next(new ErrorHandler(404,"Quiz Not Found"));
        const ques = await Question.findById(quesId);
        if(!ques)
            return next(new ErrorHandler(404,"Question Not Found"));
        quiz.questions.push({question:quesId,time,points});
        quiz.save();
        return res.status(200).json({success:true, message:"Question Added Successfully to Quiz"});
    }),
    updateQuizQuestion : asyncWrapper(async (req, res, next) => {
        const body = req.body;
        const quizId = req.params.quizId;
        const quesId = req.params.quesId;
        const quiz = await Quiz.findById(quizId);
        if(!quiz)
            return next(new ErrorHandler(404,"Quiz Not Found"));
        
        // find the question in the quiz and update it using body
        const ques = quiz.questions.find(ques => ques.question==quesId);
        if(!ques)
            return next(new ErrorHandler(404,"Question Not Found in quiz"));
        ques = body;
        quiz.save();
        return res.status(200).json({success:true, message:"Question Updated Successfully in Quiz"});
    }),
    getQuiz : asyncWrapper(async (req, res, next) => {
        const quizId = req.params.quizId;

        const quiz = await Quiz.findById(quizId).populate("questions.question");
        if(!quiz)
            return next(new ErrorHandler(404,"Quiz Not Found"));
        const data = {
            quiz
        }
        return res.status(200).json({success:true, message:"Quiz Fetched Successfully",data});
    }),
    getQuizzes : asyncWrapper(async (req, res, next) => {
        const quizzes = await Quiz.find({}).populate("createdBy",{name:1});
        const data = {
            quizzes
        }
        return res.status(200).json({success:true, message:"Quizzes Fetched Successfully",data});
    }),
    deleteQuiz : asyncWrapper(async (req, res, next) => {
        const quizId = req.params.quizId;
        const quiz = await Quiz.deleteOne({_id:quizId,createdBy:req.user._id});
        console.log(quiz);
        if(!quiz)
            return next(new ErrorHandler(404,"Quiz Not Found"));
        return res.status(200).json({success:true, message:"Quiz Deleted Successfully"});
    }),
    getUnselectedQuestions : asyncWrapper(async (req,res,next) => {
        const quizId = req.params.quizId;
        const quiz = await Quiz.findById(quizId);
        const questionIdsInQuiz = quiz.questions.map(q => q.question);

        const questions = await Question.find({ _id: { $nin: questionIdsInQuiz } });
        const data = {
            questions
        }
        return res.status(200).json({success:true, message:"Questions Fetched Successfully",data});
    }),
}