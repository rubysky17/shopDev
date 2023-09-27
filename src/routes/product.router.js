const productRouter = require("express").Router();
const ProductController = require("../controllers/product.controller");
const { authentication } = require("../auth/auth.utils");

const { asyncHandler } = require("../auth/checkAuth.utils");

productRouter.use(authentication);

// ! [POST]: Tạo sản phẩm
productRouter.post("/", asyncHandler(ProductController.createProduct));

module.exports = productRouter;
