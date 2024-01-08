const discountRouter = require("express").Router();
const DiscountController = require("../controllers/discount.controller");
const { authentication } = require("../auth/auth.utils");

const { asyncHandler } = require("../auth/checkAuth.utils");



// ! [GET]: Lấy danh sách mã khuyến mãi theo Shop (userId)
discountRouter.get("/shop", asyncHandler(DiscountController.getAllDiscountCodesByShop));

// ! [GET]: Lấy giá trị khuyến mãi theo mã khuyến mãi
discountRouter.get("/amount", asyncHandler(DiscountController.getDiscountAmount));

discountRouter.use(authentication);

// ! [POST]: Tạo mã khuyến mãi
discountRouter.post("/create", asyncHandler(DiscountController.createDiscountCode));


discountRouter.get("/products", asyncHandler(DiscountController.getDiscountCodesWithProduct));

module.exports = discountRouter;
