'use strict'
const { NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const { findProduct } = require("../models/repositories/product.repo")
const { convertToObjectIdMongodb } = require("../utils");

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
        const { userId, product } = payload;
        const { productId, quantity } = product

        const query = { cart_userId: userId, "cart_products.productId": productId, cart_state: "active" };

        const updateSet = {
            $inc: {
                'cart_products.$.quantity': +quantity
            }
        };

        const options = {
            upsert: true,
            new: true
        }

        return await cartModel.findOneAndUpdate(query, updateSet, options)
    }


    static async getToCart(payload) {
        return await cartModel.findOne({
            cart_userId: payload.userId
        }).lean();
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
            return await CartService.createUserCart({
                userId,
                product
            })
        }

        // ! Nếu có giỏ hàng nhưng chưa có sản phẩm
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product];

            return await userCart.save();
        }

        const productIsExist = userCart.cart_products.findIndex(y => y.productId === product.productId) !== -1

        if (productIsExist) {
            // ! Nếu có giỏ hàng và có sản phẩm trùng thì update số lượng lên 
            return await CartService.updateQuantity({
                userId,
                product
            });
        } else {
            let newProducts = [...userCart.cart_products]
            newProducts.push(product)

            userCart.cart_products = newProducts;

            return await userCart.save();
        }
    }


    /**
     * Example Payload
     * shop_order_ids: 
     *  {
     *      shopId,
     *      item_products: [
     *          {
     *              quantity,
     *              price,
     *              shopId,
     *              old_quantity,
     *              productId
     *          }
     *      ]
     *  }
     * 
     */
    static async addToCartV2(payload) {
        const { userId, shop_order_ids } = payload;

        const { quantity, old_quantity, productId } = shop_order_ids[0]?.item_products[0];

        // ! Tìm kiếm Product theo Id
        const foundProduct = await findProduct({
            product_id: convertToObjectIdMongodb(productId)
        });

        if (!foundProduct) throw new NotFoundError("Không tìm thấy sản phẩm");

        // ! Trường hợp: Product trong giỏ hàng có shopId khác với Product shopId tìm được (product khác shop)

        // ! Trường hợp: số lượng bằng = 0 => xoá sp ra khỏi giỏ hàng
        if (!quantity) {
            return await CartService.deleteCartItem({
                userId,
                productId
            })
        }

        // ! Trường hợp: quantity không khả dụng (nhỏ hơn hàng trong kho)
        if (foundProduct.product_quantity < +quantity) {
            throw new NotFoundError("Vượt quá số lượng hàng có thể bán");
        }

        // ! Trường hợp: SP đó đã tồn tại thì update
        // ! Trường hợp: SP đó chưa tồn tại thì thêm vào
        return await CartService.updateQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteCartItem(payload) {
        const { userId, productId } = payload;

        const query = {
            cart_userId: userId,
            cart_state: 'active'
        };

        const updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }

        const deleteCartItem = await cartModel.updateOne(query, updateSet)

        return deleteCartItem
    }

}

module.exports = CartService;