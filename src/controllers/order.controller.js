const OrderService = require("../services/order.service");

const { OK } = require("../core/success.response");

class OrderController {
    getOrder = async (req, res, next) => {
        new OK({
            message: "Find all products Success!",
            metadata: await OrderService.getOrder({
                product_id: req.params.product_id,
            }),
        }).send(res);
    };
}

module.exports = new OrderController();
