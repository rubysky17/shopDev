"use strict";

const {
  Product,
  Clothing,
  Electronic,
  Furniture,
} = require("../../models/product.model");

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

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductsByUser,
};
