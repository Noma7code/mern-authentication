const { userModel } = require("../models/user.model")

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

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

module.exports = {
    register,
    login,
    logout
}
