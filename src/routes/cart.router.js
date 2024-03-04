const cartRouter = require("express").Router();
const CartController = require("../controllers/cart.controller");
const { authentication } = require("../auth/auth.utils");

const { asyncHandler } = require("../auth/checkAuth.utils");

cartRouter.use(authentication);

// ! [POST]: Thêm product vào giỏ hàng
cartRouter.post(
    "/add",
    asyncHandler(CartController.createCart)
);

// ! [GET]: lấy thông tin giỏ hàng
cartRouter.get(
    "/get",
    asyncHandler(CartController.getCart)
);

// ! [DELETE]: Xoá Item bên trong giỏ hàng
cartRouter.delete(
    "/delete",
    asyncHandler(CartController.deleteToCartItem)
);


// ! [POST]: Cập nhật giỏ hàng
cartRouter.post(
    "/update",
    asyncHandler(CartController.updateToCart)
);


module.exports = cartRouter;
