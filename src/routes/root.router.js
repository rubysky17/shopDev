const rootRouter = require("express").Router();
const shopRouter = require("./shop.router");
const authRouter = require("./auth.router");

const { apiKey, permission } = require("../auth/checkAuth.utils");

rootRouter.use(apiKey);
rootRouter.use(permission("1111"));

rootRouter.use("/shop", shopRouter);
rootRouter.use("/auth", authRouter);

module.exports = rootRouter;
