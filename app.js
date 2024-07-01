require("dotenv").config()

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const PORT = process.env.PORT;

const placesRoutes = require("./routes/places.routes");

const app = express();

app.use("/api/places", placesRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});