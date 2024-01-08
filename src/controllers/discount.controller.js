const DiscountService = require("../services/discount.service");

const { CREATED, OK, UPDATED } = require("../core/success.response");

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new CREATED({
            message: "Create new discount success!",
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.keyStore.user,
            })
        }).send(res);
    };

    getAllDiscountCodesByShop = async (req, res, next) => {
        new OK({
            message: "Get all by Shop success!!",
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
            }),
        }).send(res);
    }

    getDiscountCodesWithProduct = async (req, res, next) => {
        new OK({
            message: "Get all by Products success!!",
            metadata: await DiscountService.getDiscountCodesWithProduct({
                ...req.query,
                ...req.body,
                shopId: req.keyStore.user,
            }),
        }).send(res);
    }

    getDiscountAmount = async (req, res, next) => {
        new OK({
            message: "Get discount amount success!!",
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            }),
        }).send(res);
    }
}

module.exports = new DiscountController();
