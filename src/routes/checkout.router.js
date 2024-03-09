const checkoutRouter = require("express").Router();
const CheckoutController = require("../controllers/checkout.controller");
const { authentication } = require("../auth/auth.utils");

const { asyncHandler } = require("../auth/checkAuth.utils");

// ! Kiểm tra phải đăng nhập
checkoutRouter.use(authentication);

// ! [POST]: Thêm product vào giỏ hàng
checkoutRouter.post(
    "/review",
    asyncHandler(CheckoutController.checkoutReview)
);

module.exports = checkoutRouter;
