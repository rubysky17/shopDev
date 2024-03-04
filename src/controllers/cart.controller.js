const CartService = require("../services/cart.service");

const { CREATED, OK, UPDATED } = require("../core/success.response");

class CartController {
    createCart = async (req, res, next) => {
        new CREATED({
            message: "Create new cart success!",
            metadata: await CartService.addToCart(req.body),
        }).send(res);
    };

    getCart = async (req, res, next) => {
        new OK({
            message: "Get cart success!",
            metadata: await CartService.getToCart({
                userId: req.body.userId
            }),
        }).send(res);
    };

    deleteToCartItem = async (req, res, next) => {
        new OK({
            message: "Delete cart item success!",
            metadata: await CartService.deleteCartItem({
                ...req.body
            }),
        }).send(res);
    };

    updateToCart = async (req, res, next) => {
        new OK({
            message: "Update cart success!",
            metadata: await CartService.addToCartV2({
                ...req.body
            }),
        }).send(res);
    };
}

module.exports = new CartController();
