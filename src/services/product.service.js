"use strict";

const {
  Product: ProductModel,
  Clothing: ClothingModel,
  Electronic: ElectronicModel,
} = require("../models/product.model");

const { BadRequestError } = require("../core/error.response");

class ProductFactory {
  /**
   * Type: 'Clothing'
   * Payload
   */

  static async createProduct(type, payload) {
    switch (type) {
      case "Clothing":
        return new Clothing(payload).createProduct();

      case "Electronics":
        return new Electronics(payload).createProduct();

      default:
        throw new BadRequestError(`Invalid product type: ${type}`);
    }
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
  async createProduct() {
    return await ProductModel.create(this);
  }
}

// ! Defined sub-class cho cho những product type khác nhau
// ! VD: clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await ClothingModel.create(this.product_attributes);

    if (!newClothing) {
      throw new BadRequestError("Create new Clothing Error");
    }

    const newProduct = await super.createProduct();

    if (!newProduct) {
      throw new BadRequestError("Create new Product Error");
    }

    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    console.log("create createProduct");
    const newClothing = await ElectronicModel.create(this.product_attributes);

    if (!newClothing) {
      throw new BadRequestError("Create new Eletronic Error");
    }

    const newProduct = await super.createProduct();

    if (!newProduct) {
      throw new BadRequestError("Create new Product Error");
    }

    return newProduct;
  }
}

module.exports = ProductFactory;
