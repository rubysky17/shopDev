"use strict";

const {
  Product,
  Clothing,
  Electronic,
  Furniture,
} = require("../../models/product.model");

const { getSelectDate, unGetSelectDate } = require("../../utils");

const { Types } = require("mongoose");

const findAllProductByQuery = async ({ query, limit, skip }) => {
  {
    return await Product.find(query)
      .populate("product_shop", "name email -_id")
      .sort({
        updateAt: -1, // ! Lấy thằng mới nhất
      })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  }
};

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await findAllProductByQuery({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await findAllProductByQuery({ query, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const { modifiedCount } = await Product.findOneAndUpdate(
    {
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id),
    },
    {
      $set: {
        isDraft: false,
        isPublished: true,
      },
    }
  );

  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const { modifiedCount } = await Product.findOneAndUpdate(
    {
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id),
    },
    {
      $set: {
        isDraft: true,
        isPublished: false,
      },
    }
  );

  return modifiedCount;
};

const searchProductsByUser = async ({ keyword }) => {
  const regexSearch = new RegExp(keyword);

  const results = await Product.find(
    {
      isPublished: true,
      $text: { $search: regexSearch },
    },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return results;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;

  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const products = await Product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectDate(select))
    .lean();
  console.log("findAllProducts", { products })
  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  const products = await Product.findById(product_id).select(
    unGetSelectDate(unSelect)
  );

  return products;
};

const updateProductById = async ({
  product_id,
  payload,
  model,
  isNew = true,
}) => {
  const updatedProduct = model.findByIdAndUpdate(product_id, payload, {
    new: isNew,
  });

  return updatedProduct;
};

const findProductItem = async (product_id) => {
  const products = await Product.findOne({
    _id: product_id
  }).lean();

  return products;
};

const verifyProductsWithCheckout = async (products) => {
  return await Promise.all(products.map(async (product) => {
    const foundProduct = await findProductItem(product.productId);
    console.log({
      foundProduct
    })
    if (foundProduct) {
      return {
        price: foundProduct.product_price,
        quantity: product.quantity,
        productId: product.productId
      }
    }
  }))
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  findProductItem,
  verifyProductsWithCheckout
};
