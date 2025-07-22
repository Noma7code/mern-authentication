const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/mongodb");
const { authRouter } = require("./routes/auth.route");
const { userRouter } = require("./routes/user.route");

const PORT = process.env.PORT;
connectDB();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(morgan("combined"));
app.use(cookieParser());

//API ENDPOINTS
app.get("/", (req, res) => {
  return res.json("API Working");
});
app.use("/api/auth", authRouter);
app.use("/api/user/", userRouter);

app.listen(PORT, (err) => {
  console.log(`Listening on Port ${PORT}`);
});
