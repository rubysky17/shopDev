const InventoryService = require("../services/inventory.service");

const { OK } = require("../core/success.response");

class InventoryController {
    addStockToInventory = async (req, res, next) => {
        new OK({
            message: "Thêm thành công!!",
            metadata: await InventoryService.addStockToInventory(req.body),
        }).send(res);
    }
}

module.exports = new InventoryController();
