const mongoose = require("mongoose");

//todo: usermodel=> all fields required for authentication
const userSchema = new mongoose.Schema({
    name: {type: String , required: true},
    email: {type:String, required: true, unique:true},
    password : {type:Number, required:true},
    verifyOtp: {type: Number, required:true , default: ""},
    verifyOtpExpireAt : {type:Number,required:true , default:0},
    resetOtp: {type: Number, required:true , default: ""},
    verifyResetOtpExpireAt : {type: Number, required:true , default: 0},
})

const userModel = mongoose.model("mern-auth-cluster", userSchema)

module.exports = userModel;