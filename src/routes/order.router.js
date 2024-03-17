const orderRouter = require("express").Router();
const OrderController = require("../controllers/order.controller");
const { authentication } = require("../auth/auth.utils");

const { asyncHandler } = require("../auth/checkAuth.utils");

orderRouter.use(authentication);

// ! [POST]: Lấy thông tin đơn đặt hàng
orderRouter.post(
    "/get",
    asyncHandler(OrderController.getOrder)
);

module.exports = orderRouter;
