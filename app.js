const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
// const indexRoute = require("./routes/index.routes")
// const authRoute = require("./routes/auth.routes")

const {
  errorHandler,
  notFoundHandler,
} = require("./middlewares/error-handling");
require("dotenv").config();
require("./config/dbConfig");
const PORT = process.env.PORT;

//Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("common"));
app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./routes/index.routes"));
app.use("/auth", require("./routes/auth.routes"));

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is  running on http://localhost:${PORT}`);
});
