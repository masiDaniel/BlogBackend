require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const connectMongoDB = require("./init/mongodb");
const {authRoute, categoryRoute, fileRoute} = require("./routes")
const morgan = require("morgan");
const {errorHandler} = require("./middlewares");
const notFound = require("./controllers/notfound");

// intialize app 
const app = express();

// connect database
connectMongoDB();
// third part middleware
app.use(express.json({limit : "500mb"}));
app.use(bodyParser.urlencoded({limit: "500mb", extended: true}));
app.use(morgan("dev"));

// Routes section
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/category", categoryRoute)
app.use("/api/v1/file", fileRoute)


//  not found 
app.use(notFound);

// error handling middleware 
app.use(errorHandler);


module.exports = app;