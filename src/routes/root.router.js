const rootRouter = require("express").Router();
const shopRouter = require("./shop.router");
const authRouter = require("./auth.router");
const productRouter = require("./product.router");
const discountRouter = require("./discount.router");
const cartRouter = require("./cart.router");
const checkoutRouter = require("./checkout.router");
const orderRouter = require("./order.router");

// const { apiKey, permission } = require("../auth/checkAuth.utils");

// rootRouter.use(apiKey);
// rootRouter.use(permission("1111"));

rootRouter.use("/shop", shopRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/products", productRouter);
rootRouter.use("/cart", cartRouter);
rootRouter.use("/discount", discountRouter);
rootRouter.use("/checkout", checkoutRouter);
rootRouter.use("/order", orderRouter);

module.exports = rootRouter;