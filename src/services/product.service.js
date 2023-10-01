"use strict";
/**
 * ? Workflow như sau:
 * Nhận payload của 1 sản phẩm cần tạo => tạo category với _id = 1 sau đó lây _id = 1 đó của category gán vào cho sản phẩm luôn vậy sản phẩm sẽ có _id trùng với _id của category
 */

const {
  Product: ProductModel,
  Clothing: ClothingModel,
  Electronic: ElectronicModel,
} = require("../models/product.model");

const { BadRequestError } = require("../core/error.response");

const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductsByUser,
} = require("../models/repositories/product.repo");

class ProductFactory {
  /**
   * Type: 'Clothing'
   * Payload
   */

  static productRegistry = {};

  static registryProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];

    if (!productClass)
      throw new BadRequestError(`Invalid product type: ${type}`);

    return new productClass(payload).createProduct();
  }

  // * without Stategy Pattern
  // static async createProduct(type, payload) {
  //   switch (type) {
  //     case "Clothing":
  //       return new Clothing(payload).createProduct();
  //     case "Electronics":
  //       return new Electronics(payload).createProduct();
  //     default:
  //       throw new BadRequestError(`Invalid product type: ${type}`);
  //   }
  // }

  /**
   * @Function Tìm tất cả các sản phẩm có trạng thái là Nháp
   * @Params product_shop: id shop cần lấy
   * @Params skip: Số trang
   * @Params limit: giới hạn item cần lấy
   */
  static async findAllDraftsForShop({ product_shop, skip = 0, limit = 20 }) {
    const query = {
      product_shop,
      isDraft: true,
    };

    return await findAllDraftsForShop({ query, limit, skip });
  }

  /**
   * @Function Tìm tất cả các sản phẩm có trạng thái là Published
   * @Params product_shop: id shop cần lấy
   * @Params skip: Số trang
   * @Params limit: giới hạn item cần lấy
   */
  static async findAllPublishForShop({ product_shop, skip = 0, limit = 20 }) {
    const query = {
      product_shop,
      isDraft: false,
    };

    return await findAllPublishForShop({ query, limit, skip });
  }

  /**
   * @Function Cập nhật Product thành publish
   * @Params product_shop: id shop cần lấy
   * @Params product_id: id product cần đổi tên
   */
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({
      product_shop,
      product_id,
    });
  }

  /**
   * @Function Cập nhật Product thành draft
   * @Params product_shop: id shop cần lấy
   * @Params product_id: id product cần đổi tên
   */
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({
      product_shop,
      product_id,
    });
  }

  /**
   * @Function Tìm kiếm sản phẩm
   * @Params keyword
   */
  static async searchProductsByUser({ keyword }) {
    return await searchProductsByUser({
      keyword,
    });
  }
}

// Định nghĩa 1 product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    (this.product_name = product_name),
      (this.product_thumb = product_thumb),
      (this.product_description = product_description),
      (this.product_price = product_price),
      (this.product_quantity = product_quantity),
      (this.product_type = product_type),
      (this.product_shop = product_shop),
      (this.product_attributes = product_attributes);
  }

  // ? Create new Product
  async createProduct(product_id) {
    return await ProductModel.create({
      ...this,
      _id: product_id,
    });
  }
}

// ! Defined sub-class cho cho những product type khác nhau
// ! VD: clothing
class Clothings extends Product {
  async createProduct() {
    const newClothing = await ClothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newClothing) {
      throw new BadRequestError("Create new Clothing Error");
    }

    const newProduct = await super.createProduct(newClothing._id);

    if (!newProduct) {
      throw new BadRequestError("Create new Product Error");
    }

    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await ElectronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newElectronic) {
      throw new BadRequestError("Create new Eletronic Error");
    }

    const newProduct = await super.createProduct(newElectronic._id);

    if (!newProduct) {
      throw new BadRequestError("Create new Product Error");
    }

    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await ClothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newFurniture) {
      throw new BadRequestError("Create new furniture Error");
    }

    const newProduct = await super.createProduct(newFurniture._id);

    if (!newProduct) {
      throw new BadRequestError("Create new Product Error");
    }

    return newProduct;
  }
}

// * Register Product Type
ProductFactory.registryProductType("Clothings", Clothings);
ProductFactory.registryProductType("Electronics", Electronics);
ProductFactory.registryProductType("Furniture", Furniture);

module.exports = ProductFactory;