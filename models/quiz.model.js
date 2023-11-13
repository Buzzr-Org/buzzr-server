const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const quizSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    questions:[{
        question:{type: ObjectId, ref: "question"},
        time: {type: Number, default: 20},
        position: Number,
        points: Number,
    }],
    createdBy: {
        type: ObjectId,
        ref: "user",
    }
},{timestamps: true});

const quizModel = mongoose.model("quiz", quizSchema);

module.exports = quizModel;