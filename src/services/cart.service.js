'use strict'
const cartModel = require("../models/cart.model");
/**
 * Key features: Cart Services
 * - add product to cart
 * - reduce product quantity by one [user]
 * - increase producty quantity by one [User]
 * - get cart [user]
 * - delete cart [user]
 * - delete cart item [user]
 */

class CartService {
    // START REPO SERVICE
    static async createUserCart(payload) {
        const { userId, product = {} } = payload;

        const query = { cart_userId: userId, cart_state: "active" };

        const updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        };

        const options = {
            upsert: true,
            new: true
        };

        return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    }


    static async updateQuantity(payload) {
        const { userId, product = {} } = payload;
        const { productId, product_quantity } = product

        const query = { cart_userId: userId, "cart_products.productId": productId, cart_state: "active" };

        const updateSet = {
            $inc: {
                'cart_products.$.quantity': product_quantity
            }
        };

        const options = {
            upsert: true,
            new: true
        }

        return await cartModel.findOneAndUpdate(query, updateSet, options)
    }

    // END REPO SERVICE
    static async addToCart(payload) {
        const { userId, product = {} } = payload;

        // Kiểm tra xem giỏ hàng đã tồn tại hay chưa ?
        const userCart = await cartModel.findOne({
            cart_userId: userId
        });

        if (!userCart) {
            // create cart for user
            return await CartService.addToCart({
                userId,
                product
            })
        }

        // ! Nếu có giỏ hàng nhưng chưa có sản phẩm
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product];

            return await userCart.save();
        }

        // ! Nếu có giỏ hàng và có sản phẩm trùng thì update số lượng lên 
        return await CartService.updateQuantity({
            userId,
            product
        })

    }
}

module.exports = CartService;