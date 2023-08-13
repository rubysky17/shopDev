require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const rootRouter = require("./routes/root.router");
const app = express();

// * init middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// * init DB
require("./dbs/init.mongodb");

// * Test How many Request in DB
const { countConnect } = require("./helpers/check.connect");

countConnect();
// checkOverload();

// * init Router
app.use("/v1/api", rootRouter);

// * handle Error

module.exports = app;
