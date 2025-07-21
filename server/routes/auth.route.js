const express = require("express")
const { register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated } = require("../controllers/auth.controller")
const { userAuth } = require("../middlewares/auth.middleware")
const authRouter = express.Router()

//registration endpoint
authRouter.post('/register', register)

//login
authRouter.post('/login',login)

//logout
authRouter.post('/logout',logout)
//verifyOtp
authRouter.post('/send-otp', userAuth , sendVerifyOtp)
//verifyEmail 
authRouter.post('/verify-account', userAuth , verifyEmail)
//is account authenticated
authRouter.post('/is-auth', userAuth , isAuthenticated)


module.exports = {
    authRouter
}