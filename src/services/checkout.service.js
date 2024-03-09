'use strict'

const { findCartById } = require("../models/repositories/cart.repo");
const { verifyProductsWithCheckout } = require("../models/repositories/product.repo");

const DiscountService = require("../services/discount.service");
const { BadRequestError } = require("../core/error.response");

class CheckoutService {
    /** Login and without login */
    static async checkoutReview(payload) {
        const { cartId, userId, shop_order_ids = [] } = payload;

        // ! Tìm giỏ hàng theo ID giỏ hàng
        const foundCart = await findCartById(cartId);

        if (!foundCart) throw new BadRequestError("Cart Not Found")

        // ! Sau khi có được thông tin giỏ hàng: kiểm tra sản phẩm trohng giỏ hàng với server
        const checkout_order = {
            totalPrice: 0, // Tổng tiền đơn hàng
            feeShip: 0, // Tổng ship
            totalDiscount: 0, // Tổng mã giảm giá
            totalCheckout: 0, // Tổng phải thanh toán
        }

        const shop_order_ids_new = []; // List những sản phẩm mới

        // ! Tính tổng tiền bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i];

            // & Kiểm tra sản phẩm có hợp lệ hay không ?
            const checkProductWithCheckout = await verifyProductsWithCheckout(item_products);

            if (!checkProductWithCheckout[0]) throw new BadRequestError("Cart Error")

            const checkoutPrice = checkProductWithCheckout.reduce((acc, product) => {
                return acc + (product.quantity * product.price);
            }, 0);

            checkout_order.totalPrice = parseInt(checkoutPrice);

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // Tiền trước khi giảm giá
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductWithCheckout
            }

            //  Nếu shop_discounts > 0 check xem có hợp lệ hay không ?
            if (shop_discounts.length > 0) {
                // giả sử có 1 discount
                // lấy tổng giá trị giảm giá của discount đó
                const { totalPrice = 0, discount = 0 } = await DiscountService.getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductWithCheckout.map((prod) => {
                        return {
                            productId: prod.productId,
                            product_quantity: prod.price,
                            product_price: prod.quantity
                        }
                    })
                });
                console.log({
                    discount
                })
                // Tổng cộng Discount giảm giá
                checkout_order.totalDiscount += discount;

                // Tiên giảm giá > 0
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount;
                }
            }

            // Tổng thanh toán cuối cùng
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order,
        }
    }

}

module.exports = CheckoutService;