'use strict'

const { BadRequestError } = require("../core/error.response");
const { findProduct } = require("../models/repositories/product.repo")
const inventoryModel = require("../models/inventory.model")

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = ""
    }) {
        const product = await findProduct(productId);

        if (!product) throw new BadRequestError("Product does not exists")

        const query = {
            inven_shopId: shopId,
            inven_productId: productId
        }

        const updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        }

        const options = {
            upsert: true,
            new: true
        }

        return await inventoryModel.findOneAndUpdate(query, updateSet, options)
    }

}

module.exports = InventoryService