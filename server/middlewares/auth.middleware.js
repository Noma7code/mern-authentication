const jwt = require("jsonwebtoken")

async function userAuth(req,res,next) {
    const {token} = req.cookies
    if(!token){
        return res.json({success:false, message:"Not authorised, login again"})
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        if(tokenDecode.id){
            req.userId = tokenDecode.id
        }else{
            return res.json({success:false, message:"Not authorised, login again"})
        }

        next()
        
    } catch (error) {
        return res.json({success:false, message:error.message})
        
    }
}

module.exports = {
    userAuth
}