require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");

const app = express();

// * init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// * init DB
require("./dbs/init.mongodb");

// * Test How many Request in DB
const { countConnect, checkOverload } = require("./helpers/check.connect");

countConnect();
// checkOverload();

// * init Router
app.get("/", (req, res, next) => {
  return res.status(200).json("hello world");
});

// * handle Error

module.exports = app;
