"use strict";

const mongoose = require("mongoose"); // Erase if already required

const COLLECTION_NAME = "Inventories"; // ! Collection sẽ có 's'
const DOCUMENT_NAME = "Inventory"; // ! Document name sẽ không có 's'

const { Schema } = mongoose;

// Declare the Schema of the Mongo model
let inventorySchema = new mongoose.Schema(
  {
    inven_productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    inven_location: {
      type: String,
      default: "unknown",
    },
    inven_stock: {
      type: Number,
      required: true,
    },
    inven_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    // Khi khách hàng đặt hàng trước => Khi thanh toán thì xoá khỏi đây
    inven_reservations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Export the model
const Inventory = mongoose.model(DOCUMENT_NAME, inventorySchema);

module.exports = { Inventory };
