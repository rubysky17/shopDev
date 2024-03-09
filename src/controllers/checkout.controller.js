const CheckoutService = require("../services/checkout.service");

const { OK } = require("../core/success.response");

class CheckoutController {
    checkoutReview = async (req, res, next) => {
        new OK({
            message: "Checkout success success!",
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res);
    };

}

module.exports = new CheckoutController();
