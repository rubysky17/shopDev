const rootRouter = require("express").Router();
const shopRouter = require("./shop.router");
const authRouter = require("./auth.router");

rootRouter.use("/shop", shopRouter);
rootRouter.use("/auth", authRouter);

module.exports = rootRouter;
