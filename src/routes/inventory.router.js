const inventoryRouter = require("express").Router();
const InventoryController = require("../controllers/inventory.controller");
const { authentication } = require("../auth/auth.utils");

const { asyncHandler } = require("../auth/checkAuth.utils");

inventoryRouter.use(authentication);

// ! [POST]: Thêm product vào giỏ hàng
inventoryRouter.post(
    "/add",
    asyncHandler(InventoryController.addStockToInventory)
);


module.exports = inventoryRouter;
