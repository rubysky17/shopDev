const { convertToObjectIdMongodb } = require("../../utils");
const { Inventory } = require("../inventory.model");
const { Types } = require("mongoose");

const insertInventory = async ({
  product_id,
  shop_id,
  stock,
  location = "unknown",
}) => {
  return await Inventory.create({
    inven_productId: product_id,
    inven_shopId: shop_id,
    inven_stock: stock,
    inven_location: location,
  });
};

const reservationInventory = async ({ productId, quantity, cardId }) => {
  const query = {
    inven_productId: convertToObjectIdMongodb(productId),
    inven_stock: {
      $gte: quantity
    }
  }

  const updateSet = {
    $inc: {
      inven_stock: -quantity
    },
    $push: {
      inven_reservation: {
        quantity,
        cardId,
        createOn: new Date()
      }
    }
  }

  const options = {
    upsert: true, new: true
  }

  return await Inventory.updateOne(query, updateSet, options)
}

module.exports = {
  insertInventory,
  reservationInventory
};
