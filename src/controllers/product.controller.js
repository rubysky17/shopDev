const ProductService = require("../services/product.service");

const { CREATED, OK } = require("../core/success.response");

class ProductController {
  createProduct = async (req, res, next) => {
    new CREATED({
      message: "Create new product success!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.keyStore.user,
      }),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new ProductController();
