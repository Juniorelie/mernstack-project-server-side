const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan")
const cors = require("cors")
const userRoute = require("./routes/users.routes")
const authRoute = require("./routes/auth.routes")

require("dotenv").config()
require("./config/dbConfig");
const PORT = process.env.PORT

//Middleware
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use(express.urlencoded({ extended: true }))

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)


// app.get("/", (req, res, next) =>{
//     res.status(200).json({ message : "Welcome to homepage" })
// })

// app.get("/users", (req, res, next) =>{
//     res.status(200).json({ message : "Welcome to users page" })
// })

app.listen(PORT, () => {
	console.log(`Server is  running on http://localhost:${PORT}`)
})