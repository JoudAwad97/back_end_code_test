// init the express application
const express = require("express");
const dotenv = require("dotenv");

// import routes
const { RecommendRoute } = require("./routes/index");

// assign express constructor to a variable
const app = express({ extends: true });

// connect application with the .env
dotenv.config();

// implement the database connection
require("./db");

// init the routes in the system
app.use(RecommendRoute);

module.exports = app;
