require("dotenv").config()

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const PORT = process.env.PORT;

const placesRoutes = require("./routes/places.routes");

const app = express();

app.use("/api/places", placesRoutes);

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