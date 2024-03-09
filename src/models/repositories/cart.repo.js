const CartModel = require("../cart.model");
const { convertToObjectIdMongodb } = require("../../utils");

const findCartById = async (cartId) => {
    return await CartModel.findOne({
        _id: convertToObjectIdMongodb(cartId),
        cart_state: "active"
    }).lean()
}

module.exports = {
    findCartById,
};
