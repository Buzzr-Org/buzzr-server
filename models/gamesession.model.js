const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const gameSessionSchema = mongoose.Schema({
    quiz: {
        type: ObjectId,
        ref: 'quiz',
        required: true
    },
    participants: [{
        name: { type: String, required: true },
        score: { type: Number, default: 0 },
    }],
    currentQuestionIndex: {
        type: Number,
        default: 0
    },
    creator:{
        type: ObjectId,
        ref: "user",
    },
}, { timestamps: true });

const gameSessionModel = mongoose.model('gameSession', gameSessionSchema);

module.exports = gameSessionModel;