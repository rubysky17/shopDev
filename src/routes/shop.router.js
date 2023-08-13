const shopRouter = require("express").Router();

shopRouter.get("/", (req, res, next) => {
  return res.status(200).json("hello world");
});

module.exports = shopRouter;
