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
    verify:{
        type: Boolean,
        default: false,
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    lastRefesh: {
        type: Date,
        default: Date.now,
    },
});

const userModel = mongoose.model("user",userSchema);

module.exports= userModel;