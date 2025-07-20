const express = require("express")
const { register, login, logout } = require("../controllers/auth.controller")
const authRouter = express.Router()

//registration endpoint
authRouter.post('/register', register)

//login
authRouter.post('/login',login)

//logout
authRouter.post('/logout',logout)

module.exports = {
    authRouter
}