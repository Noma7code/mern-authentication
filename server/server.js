const express = require("express");
const cors = require("cors")
require("dotenv").config()
const cookieParser = require("cookie-parser");
const connectDB = require("./config/mongodb");

const PORT = process.env.PORT
connectDB()

const app = express();

app.use(cors())
app.use(express.json())
app.use(cookieParser({Credential: true}))

app.get("/", (req,res)=> {
    return res.json("API Working")
})

app.listen(PORT, (err)=> {
    console.log(`Listening on Port ${PORT}`)
}
    )