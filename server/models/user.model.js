const mongoose = require("mongoose");

//todo: usermodel=> all fields required for authentication
const userSchema = new mongoose.Schema({
    name: {type: String , required: true},
    email: {type:String, required: true, unique:true},
    password : {type:String, required:true},
    verifyOtp: {type: String, default: ""},
    verifyOtpExpireAt : {type:Number, default:0},
    isAccountVerified: {type:Boolean, default:false},
    resetOtp: {type: String, default: ""},
    verifyResetOtpExpireAt : {type: Number, default: 0},
})

const userModel = mongoose.model("mern-auth-cluster", userSchema)

module.exports = {
    userModel
}