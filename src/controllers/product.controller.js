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

  getAllDraftsForShop = async (req, res, next) => {
    new OK({
      message: "Find draft products success!",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.keyStore.user,
      }),
      options: {
        limit: 20,
      },
    }).send(res);
  };

  getAllPublishedForShop = async (req, res, next) => {
    new OK({
      message: "Find Published products success!",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.keyStore.user,
      }),
      options: {
        limit: 20,
      },
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new OK({
      message: "Published product by Id success!",
      metadata: await ProductService.publishProductByShop({
        product_shop: req.keyStore.user,
        product_id: req.params.id,
      }),
      options: {
        limit: 20,
      },
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new OK({
      message: "Unpublished product by Id success!",
      metadata: await ProductService.unPublishProductByShop({
        product_shop: req.keyStore.user,
        product_id: req.params.id,
      }),
      options: {
        limit: 20,
      },
    }).send(res);
  };

  searchProductsByUser = async (req, res, next) => {
    new OK({
      message: "search product by keyword success!",
      metadata: await ProductService.searchProductsByUser({
        keyword: req.params.keyword,
      }),
      options: {
        limit: 20,
      },
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new OK({
      message: "Find all products Success!",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new OK({
      message: "Find all products Success!",
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
