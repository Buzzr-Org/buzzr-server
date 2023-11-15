const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    lastRefresh: {
        type: Number,
        default: Math.floor(Date.now() / 1000),
    },
});

const userModel = mongoose.model("user",userSchema);

module.exports= userModel;