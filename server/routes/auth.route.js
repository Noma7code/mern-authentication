const express = require("express");
const {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  passwordReset,
} = require("../controllers/auth.controller");
const { userAuth } = require("../middlewares/auth.middleware");
const authRouter = express.Router();

//registration endpoint
authRouter.post("/register", register);

//login endpoint
authRouter.post("/login", login);

//logout endpoint
authRouter.post("/logout", logout);
//verifyOtp endpoing
authRouter.post("/send-otp", userAuth, sendVerifyOtp);
//verifyEmail endpoint
authRouter.post("/verify-account", userAuth, verifyEmail);
//is account authenticated
authRouter.get("/is-auth", userAuth, isAuthenticated);
//send resetOtp
authRouter.post("/send-resetOtp", sendResetOtp);
//reset password endpoint
authRouter.post("/reset-password", passwordReset);

module.exports = {
  authRouter,
};
