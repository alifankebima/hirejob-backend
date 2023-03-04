// Import environtment variable
require("dotenv").config();

// Import
const mainRouter = require("./src/router/index"); // Import main router
const express = require("express"); // Import express library
const helmet = require("helmet"); // Import helmet
const cors = require("cors"); // Import cors
const createError = require("http-errors"); // Import http error
const morgan = require("morgan"); // Import morgan
const xss = require("xss-clean"); // Import xss
const app = express(); // Import express
const commonHelper = require("./src/helper/common");

// Use middleware
app.use(express.json());
app.use(cors({
    methods: ["GET","PUT","POST","DELETE"]
}));
app.use(morgan("dev"));
app.use(helmet());
app.use(xss());
app.use("/img", express.static("src/upload"));

// Port choice
const port = process.env.PORT || 443;

// use Main Router
app.use("/", mainRouter);
app.all("*", (req, res, next) => {
    next(commonHelper.response(res, null, 404, "URL not Found"));
});

//Error code and message
app.use((err, req, res, next) => {
    const messageError = err.message || "Internal server error";
    const statusCode = err.status || 500;
  
    res.status(statusCode).json({
      message : messageError
    })
})

// Listening port awaiting requests
app.listen(port, () => {
    console.log(`Server run on port: ${port}`);
});
