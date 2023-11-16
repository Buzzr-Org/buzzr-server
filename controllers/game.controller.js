const otpGenerator = require('otp-generator');
const {Quiz, GameSession, Question} = require("../models");
const {ErrorHandler} = require("../middleware/errors");
const jv = require("../utils/validation");
const asyncWrapper = require("../utils/asyncWrapper");
const {setCache,getCache} = require("../utils/redisFunctions");

module.exports = {
    createGame : asyncWrapper(async (req, res) => {
        const body = await jv.createGameSession.validateAsync(req.body);
        const {quizId} = body;
        const user = req.user;
        const quiz = await Quiz.findById(quizId);
        if(!quiz)
            return next(new ErrorHandler(404,"Quiz Not Found"));
        const gameSession = await GameSession.create({
            quizId,
            createdBy: user._id
        });
        const gameCode = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });

        // set game code in cache
        setCache(gameCode,gameSession._id);

        const data = {
            gameSession
        }
        return res.status(200).json({success:true, message:"Game Session Created Successfully",data});
    }),
    joinGame : asyncWrapper(async (req, res) => {
        const body = await jv.joinGameSession.validateAsync(req.body);
        const {gameCode, name} = body;
        const gameSessionId = await getCache(gameCode);
        const gameSession = await GameSession.findById(gameSessionId);
        if(!gameSession)
            return next(new ErrorHandler(404,"Game Session Not Found"));
        const participant = {
            name,
            score: 0
        }
        gameSession.participants.push(participant);
        gameSession.save();
        const data = {
            gameSession
        }
        return res.status(200).json({success:true, message:"Joined Game Session Successfully",data});
    }),
    getQuestionInGame : asyncWrapper(async (req, res) => {
        const body = await jv.getQuestionInGame.validateAsync(req.body);
        const {gameSessionId} = body;
        const gameSession = await GameSession.findById(gameSessionId);
        if(!gameSession)
            return next(new ErrorHandler(404,"Game Session Not Found"));
        const questionId = gameSession.quiz.questions[gameSession.currentQuestionIndex];
        gameSession.save();
        const question = await Question.findById(questionId);
        const data = {
            question
        }
        return res.status(200).json({success:true, message:"Question Fetched Successfully",data});
    }),
    getNextQuestionInGame : asyncWrapper(async (req, res) => {
        const body = await jv.getNextQuestionInGame.validateAsync(req.body);
        const {gameSessionId} = body;
        const gameSession = await GameSession.findById(gameSessionId);
        if(!gameSession)
            return next(new ErrorHandler(404,"Game Session Not Found"));
        gameSession.currentQuestionIndex++;
        gameSession.save();
        const questionId = gameSession.quiz.questions[gameSession.currentQuestionIndex];
        const question = await Question.findById(questionId);
        const data = {
            question
        }
        return res.status(200).json({success:true, message:"Question Fetched Successfully",data});
    }),
    getLeaderBoardInGame : asyncWrapper(async (req, res) => {
        const body = await jv.getLeaderBoardInGame.validateAsync(req.body);
        const {gameSessionId} = body;
        const gameSession = await GameSession.findById(gameSessionId).popuplate("participants");
        if(!gameSession)
            return next(new ErrorHandler(404,"Game Session Not Found"));
        const leaderBoard = gameSession.participants.sort((a,b)=>b.score-a.score);
        const data = {
            leaderBoard
        }
        return res.status(200).json({success:true, message:"Leader Board Fetched Successfully",data});
    }),
}