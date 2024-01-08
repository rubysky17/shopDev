/**
 * 6 service chính:
 * 1. Tạo mã discount (shop | admin)
 * 2. lấy mã giảm giá (user)
 * 3. lấy tất cả mã giảm giá (User | Shop)
 * 4. Verify discount code (User)
 * 5. Xoá mã giảm giá (admin | shop)
 * 6. Huỷ mã giảm giá (user)
 */

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertToObjectIdMongodb } = require("../utils");
const { findAllDiscountCodeUnSelect, findAllDiscountCodeSelect, checkDiscountExist } = require("../models/repositories/discount.repo");

class DiscountService {
    static async createDiscountCode(payload) {
        const { start_date, end_date, code, shopId, name, description, type, value, uses_count, user_used, max_uses_per_user, min_order_value, is_active, applies_to, product_ids } = payload;

        // && Validation
        if (Date.now() > end_date) {
            throw new BadRequestError("Discount code has expired!")
        }

        if (start_date >= end_date) {
            throw new BadRequestError("Start date must be before end date")
        }

        // && Tìm xem discount đó tồn tại hay chưa ?
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean();

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError("Discount code is exist!")
        }

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: start_date,
            discount_end_date: end_date,
            discount_uses_count: uses_count,
            discount_users_used: user_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })

        return newDiscount
    }

    static async updateDiscountCode() {

    }

    static async getDiscountCodesWithProduct(payload) {
        const { code, shopId, limit, page } = payload;

        // ! create index for discount_code
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean();

        let products;

        if (foundDiscount && !foundDiscount.discount_is_active) {
            throw new NotFoundError("Discount code not exist!")
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount;
        console.log({
            discount_applies_to, discount_product_ids
        })
        if (discount_applies_to === "all") {
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            });
        }


        if (discount_applies_to === "specific") {
            products = await findAllProducts({
                filter: {
                    _id: {
                        $in: discount_product_ids, // Tìm hết id sp nào trùng vs danh sách sp được sử dụng discount
                    },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            });
        };

        return products
    }

    static async getAllDiscountCodesByShop(payload) {
        const { limit, page, shopId } = payload;

        const discounts = await findAllDiscountCodeUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            unSelect: ["__v", 'discount_shopId'],
            model: discountModel
        })

        return discounts;
    }

    static async getDiscountAmount(payload) {
        const { codeId, userId, shopId, products } = payload;

        const foundDiscount = await checkDiscountExist({
            model: discountModel,
            filter: {
                discount_shopId: shopId,
                discount_code: codeId
            }
        });

        if (!foundDiscount) {
            throw new NotFoundError("Discount code not exist!")
        }

        const { discount_is_active, discount_users_used, discount_start_date, discount_end_date, discount_min_order_value, discount_max_uses_per_user, discount_type, discount_value } = foundDiscount;

        if (!discount_is_active) throw new NotFoundError("Discount experied!!");

        if (!discount_users_used) throw new NotFoundError("Discount is out!!");

        const start_date_discount = new Date(discount_start_date)
        const end_date_discount = new Date(discount_end_date)

        if (Date.now() < start_date_discount.getTime() || Date.now() > end_date_discount.getTime()) throw new NotFoundError("Discount experied");


        // Tính tổng gía trị đơn hàng
        let totalOrders = products.reduce((acc, product) => {
            // * Kiểm tra xem product đó có được nằm trong điều kiện giảm giá của voucher hay không ???


            // số lượng nhân đơn giá
            return acc + (product.product_quantity * product.product_price)
        }, 0);


        // Kiểm tra giá trị tối thiểu của đơn hàng
        if (discount_min_order_value > 0) {
            if (totalOrders < discount_min_order_value) throw new NotFoundError(`Đơn hàng chưa đủ điều kiện áp dụng mã tối thiểu là ${discount_min_order_value}`);
        }

        if (discount_max_uses_per_user > 0) {
            const userUsedDiscount = discount_users_used.find(user => user.userId === userId);

            if (userUsedDiscount) {
                // .... Viết thêm TH user này sử dụng discount được bao nhiêu lần. Nếu đã sử dụng đủ số lần thì error còn chưa đủ thì cho sử dụng tiếp
            }
        }


        // * giá trị giảm giá
        const amountDiscount = discount_type === 'fixed_amount' ? discount_value : totalOrders * (discount_value / 100);

        return {
            totalAmountOrder: totalOrders,
            discount: amountDiscount,
            totalPrice: totalOrders - amountDiscount
        }
    }

    // ! Khi xoá thì có 2 phương án: 1 là đưa vào 1 db khác (Hoàn tác), không nên xoá khỏi database
    static async deleteDiscountCode() {
        const { shopId, codeId } = payload;

        const deleted = await discountModel.findOneAndDelete(
            {
                discount_code: codeId,
                discount_shopId: shopId
            }
        )

        return deleted;
    }

    /**
     * 
     * Khi user ấn cancel không sử dụng mã khuyến mãi nữa
     */
    static async cancelDiscountCode(payload) {
        const { codeId, shopId, userId } = payload;

        const foundDiscount = await checkDiscountExist({
            model: discountModel,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        });


        if (!foundDiscount) throw new NotFoundError(`discount doesnt exist`);


        const result = discountModel.findByIdAndUpdate(
            foundDiscount._id,
            {
                $pull: {
                    discount_users_used: userId
                },
                $inc: {
                    discount_max_uses: 1,
                    discount_uses_count: -1
                }
            }
        )
    }
}

module.exports = DiscountService