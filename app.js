require("dotenv").config();
require("./config/dbConnect");

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const PORT = process.env.PORT;

const placesRoutes = require("./routes/places.routes");
const usersRoutes = require("./routes/users.routes");

const HttpError = require("./models/error");

const app = express();
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError("Could not find this route.", 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) { //checking if a response has already been sent
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || "An unknown error occured!"});
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});