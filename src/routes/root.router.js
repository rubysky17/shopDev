const rootRouter = require("express").Router();
const shopRouter = require("./shop.router");
const authRouter = require("./auth.router");
const productRouter = require("./product.router");
const discountRouter = require("./discount.router");

// const { apiKey, permission } = require("../auth/checkAuth.utils");

// rootRouter.use(apiKey);
// rootRouter.use(permission("1111"));

rootRouter.use("/shop", shopRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/products", productRouter);
rootRouter.use("/discount", discountRouter)

module.exports = rootRouter;
