const nodemailer = require("nodemailer")

const transport = nodemailer.createTransport({
    host:'smtp.resend.com',
    port:465,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_API_KEY 
    }
})

module.exports = {
    transport
}