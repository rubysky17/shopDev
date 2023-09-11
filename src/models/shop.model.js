"use strict";

const mongoose = require("mongoose"); // Erase if already required

const COLLECTION_NAME = "Shops"; // ! Collection sẽ có 's'
const DOCUMENT_NAME = "Shop"; // ! Document name sẽ không có 's'

const { Schema } = mongoose;

// Declare the Schema of the Mongo model
let shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

shopSchema.statics.findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 2,
    name: 1,
    status: 1,
    roles: 1,
  },
}) => {
  return await Shop.findOne({ email }).select(select).lean();
};

// Export the model
const Shop = mongoose.model(DOCUMENT_NAME, shopSchema);

module.exports = Shop;
