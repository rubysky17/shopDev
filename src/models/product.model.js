"use strict";

const mongoose = require("mongoose"); // Erase if already required

const COLLECTION_NAME = "Products"; // ! Collection sẽ có 's'
const DOCUMENT_NAME = "Product"; // ! Document name sẽ không có 's'

const { Schema } = mongoose;

// Declare the Schema of the Mongo model
let productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      // ? Cai này sẽ mở rộng thêm 1 bảng collection để get type product
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

let clothingSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: String,
    material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  {
    timestamps: true,
    collection: "Clothings",
  }
);

let electronicSchema = new mongoose.Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    model: String,
    color: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  {
    timestamps: true,
    collection: "Electronics",
  }
);

let furnitureSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: String,
    material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  {
    timestamps: true,
    collection: "Furnitures",
  }
);

// Export the model
const Product = mongoose.model(DOCUMENT_NAME, productSchema);
const Clothing = mongoose.model("Clothing", clothingSchema);
const Electronic = mongoose.model("Electronic", electronicSchema);
const Furniture = mongoose.model("Furniture", furnitureSchema);

module.exports = { Product, Clothing, Electronic, Furniture };
