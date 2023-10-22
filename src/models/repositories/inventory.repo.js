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

module.exports = {
  insertInventory,
};
