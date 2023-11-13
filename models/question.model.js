const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const questionSchema = mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: [{
        option: String,
        isRight: Boolean,
    }],
    media: {
        link: {
            type: String,
            default: null,
        },
        type: {
            type: String,
            enum: ["image", "video", "audio", "none"],
            default: "none",
        }
    },
    createdBy: {
        type: ObjectId,
        ref: "user",
    }
},{timestamps: true});