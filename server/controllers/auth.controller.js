const { userModel } = require("../models/user.model")

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const { transport } = require("../config/nodemailer");

//controller func to register user
async function register(req, res){
    const {name, email , password } = req.body;
    if(!name || !email || !password){
        return res.json({sucess:false, message: "Missing user details"})
    }

    try{
        //check if user exist
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({sucess:false , message: "User already exists"})
        }

         //hash and save the password
        const hashedPassword = await bcrypt.hash(password, 10);
        //create new user
        const user = new userModel({name,email, password: hashedPassword})
        //save user in the database
        await user.save()

        //generate user token 
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
        //send token as a cookie
        res.cookie('token', token , {
            httpOnly:true,
            maxAge: 7 * 24 * 60 * 60 * 1000, //milliseconds
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
            secure : process.env.NODE_ENV === 'production'
        })

        //sending email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to nomacode",
            text: `You registered with nomacode with email id: ${email}`
        } 

        await transport.sendMail(mailOptions)

        res.json({success:true})
    }
    catch(error){
        return res.json({sucess:false, message: error.message})
    }

}

//controller function to login
async function login(req,res) {
    const {email,password} = req.body
    if(!email || !password){
        res.json({sucess:false, message: "Email and password are required"})
    }
    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({sucess:false , message: "user does not exist"})
        }
        const isPsdMatched = await bcrypt.compare(password, user.password)
        if(!isPsdMatched){
            res.json({success:false, message: "Invalid password"})
        }

        //generate session token
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET , {expiresIn: '7d'})

        res.cookie('token',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000
        })

        res.json({success:true})
        
    } catch (error) {
        res.json({sucess:false, message: error.message});
        
        
    }
    
}

//controller for logout

async function logout(req,res) {
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000
        })

        res.json({success:true, message: "Logged out"})
        
    } catch (error) {
        res.json({success:false, message:error.message})
    }
    
}

//send verification otp to user email
async function sendVerifyOtp(req,res) {
    try {
        const  {userId} = req

        const user = await userModel.findById(userId)

        if(user.isAccountVerified){
            return res.json({success:false, message: "Account is already verified"})
        }

        const otp = String(Math.floor(100000 + Math.random()*900000))
        user.verifyOtp = otp
        user.verifyOtpExpireAt = Date.now() + 30 * 60 * 1000 //30 mins in milliseconds

        await user.save()

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to:user.email,
            subject: "Account Verification Otp",
            text: `Your account verification code is ${otp}. This otp last for 30 minutes`
        }

        await transport.sendMail(mailOptions)

        res.json({sucess:true, message:"verification otp sent via email"})


        
    } catch (error) {
        res.json({success:false, message:error.message})
        
    }
    
}

//verify account
async function verifyEmail(req,res) {

    const {otp} = req.body
    const {userId} = req
    if(!userId || !otp){
        return res.json({success:false, message: "Missing details"})
    }
    try {

        const user = await userModel.findById(userId)
        if(!user){
            return res.json({success:false , message: "Invalid user"})
        }
        if(user.verifyOtp === ''|| user.verifyOtp != otp){
            return res.json({success:false, message:"Invalid otp"})
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({sucess:false, message:"Otp expired"})
        }
        user.isAccountVerified = true
        user.verifyOtp = ''
        user.verifyOtpExpireAt = 0
        
        await user.save()

        res.json({success:true, message:"Account is successfully verified"})
        
    } catch (error) {
        res.json({success:false , message:error.message})
        
    }
    
}

//check if authenticated
async function isAuthenticated(req,res) {
    try {
        return res.json({success:true})
        
    } catch (error) {
        res.json({success:false, message:error.message})
        
    }
    
}
//send reset password otp
async function sendResetOtp(req,res) {
    const {email} = req.body    
    if(!email){
        return res.json({success:false, message:"Email is required"})
    }
    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false, message: "User does not exist"})
        }

        const otp = String(Math.floor(100000 + Math.random()*900000))
        user.resetOtp = otp
        user.verifyResetOtpExpireAt = Date.now() + 30 * 60 * 1000

        await user.save()

        const mailOptions = {
            from:process.env.SENDER_EMAIL,
            to:email,
            subject: "Password reset otp",
            text: `Please enter the otp ${otp} to confirm your identity to reset your password`
        }

        await transport.sendMail(mailOptions)
        res.json({success:true, message: "Password reset otp send  via email"})

        
    } catch (error) {
        return res.json({sucess:false, message:error.message})
        
    }


}


//reset user password
async function passwordReset(req,res) {
    const {email , otp, newPassword} = req.body
    if(!email || !otp || !newPassword){
        return res.json({success:false, message:"Email , otp and newpassword are required"})
    }
    try {
        const user =  await userModel.findOne({email})

        if(!user){
            return res.json({success:false, message:"User not found"}) 
        }
        if(!user.resetOtp === '' || user.resetOtp !== otp){
            return res.json({success:false, message:"Invalid otp"})
        }
        if(user.verifyResetOtpExpireAt < Date.now()){
            return res.json({success:false, message:"Otp expired"})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password =hashedPassword
        user.resetOtp = ''
        user.verifyResetOtpExpireAt = 0

        await user.save()
        res.json({success:true, message:"Password is successfully reset"})
        
    } catch (error) {
        
    }   
}

module.exports = {
    register,
    login,
    logout,
    sendVerifyOtp,
    verifyEmail,
    isAuthenticated,
    sendResetOtp,
    passwordReset
}
