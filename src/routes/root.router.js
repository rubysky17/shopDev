const rootRouter = require("express").Router();
const shopRouter = require("./shop.router");
const authRouter = require("./auth.router");
const productRouter = require("./product.router");
const discountRouter = require("./discount.router");
const cartRouter = require("./cart.router");
const checkoutRouter = require("./checkout.router");
const inventoryRouter = require("./inventory.router");

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
rootRouter.use("/inventory", inventoryRouter);

module.exports = rootRouter;