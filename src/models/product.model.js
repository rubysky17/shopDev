"use strict";

const mongoose = require("mongoose"); // Erase if already required

const COLLECTION_NAME = "Products"; // ! Collection sẽ có 's'
const DOCUMENT_NAME = "Product"; // ! Document name sẽ không có 's'

const slugify = require("slugify");

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
    product_slug: {
      type: String,
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
      enum: ["Electronics", "Clothings", "Furnitures"],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be under 5.0"],
      set: (value) => Math.round(value * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// ! hàm pre này cho phép trước khi document được save nó sẽ chạy
// * Câu hỏi đặt ra tại sao không cấu hình nó ở trong service luôn => thì cấu hình ở chỗ này nó sẽ clean code hơn
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, {
    lower: true,
  });

  next();
});

// ! Đánh index cho search
productSchema.index({
  product_name: "text",
  product_description: "text",
});

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
