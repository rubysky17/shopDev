const productRouter = require("express").Router();
const ProductController = require("../controllers/product.controller");
const { authentication } = require("../auth/auth.utils");

const { asyncHandler } = require("../auth/checkAuth.utils");

// ! [GET]: Lấy danh sách SP theo search
productRouter.get(
  "/search/:keyword",
  asyncHandler(ProductController.searchProductsByUser)
);

// ! [GET]: Lấy tất cả sản phẩm
productRouter.get("/", asyncHandler(ProductController.findAllProducts));

// ! [GET]: Lấy chi tiết sản phẩm
productRouter.get("/:product_id", asyncHandler(ProductController.findProduct));

productRouter.use(authentication);

// ! [POST]: Tạo sản phẩm
productRouter.post("/", asyncHandler(ProductController.createProduct));

// ! [PATCH]: Sửa sản phẩm
productRouter.patch(
  "/:product_id",
  asyncHandler(ProductController.updateProduct)
);

// ! [PUT]: Publish sản phẩm
productRouter.put(
  "/published/:id",
  asyncHandler(ProductController.publishProductByShop)
);

// ! [PUT]: unpublish sản phẩm => trả về nháp
productRouter.put(
  "/unpublished/:id",
  asyncHandler(ProductController.unPublishProductByShop)
);

// ! [GET]: Lấy danh sách SP trạng thái nháp
productRouter.get(
  "/drafts/all",
  asyncHandler(ProductController.getAllDraftsForShop)
);

// ! [GET]: Lấy danh sách SP trạng thái publish
productRouter.get(
  "/published/all",
  asyncHandler(ProductController.getAllPublishedForShop)
);

module.exports = productRouter;
