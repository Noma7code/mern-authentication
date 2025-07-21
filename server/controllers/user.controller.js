const { userModel } = require("../models/user.model")


async function getUserData(req,res) {
    try {
        const {userId} = req
        const user = await userModel.findById(userId)
        if(!user){
            return res.json({sucess:false, message: "User not found"})
        }
        res.json({
            sucess:true, 
            userData: { 
                name: user.name,
                isAccountVerified:user.isAccountVerified 
            }})
    } catch (error) {
        return res.json({sucess:false, message:error.message})
        
    }
    
}
module.exports = {
    getUserData
}