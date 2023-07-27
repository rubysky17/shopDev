const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const app = express();

// * init middlewares
app.use(morgan("dev"));
// morgan("combined")
// morgan("common")
// morgan("short")
// morgan("tiny")
app.use(helmet());
// * init DB

// * init Router
app.get("/", (req, res, next) => {
  return res.status(200).json("hello world");
});

// * handle Error

module.exports = app;
