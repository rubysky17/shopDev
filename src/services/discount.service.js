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
const { findAllDiscountCodeUnSelect, findAllDiscountCodeSelect } = require("../models/repositories/discount.repo");

class DiscountService {
    static async createDiscountCode(payload) {
        const { start_date, end_date, code, shopId, name, description, type, value, uses_count, user_used, max_uses_per_user, min_order_value } = payload;

        // && Validation
        if (newDate() < newDate(start_date) || newDate() > newDate(end_date)) {
            throw new BadRequestError("Discount code has expired!")
        }

        if (newDate(start_date) >= newDate(end_date)) {
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
        const { code, shopId, userId, limit, page } = payload;
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

        if (discount_applies_to === "all") {
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublish: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }


        if (discount_applies_to === "specific") {
            products = await findAllProducts({
                filter: {
                    _id: {
                        $in: discount_product_ids, // Tìm hết id sp nào trùng vs danh sách sp được sử dụng discount
                    },
                    isPublish: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

    }

    static async getAllDiscountCodesByShop(payload) {
        const { limit, page, shopid } = page
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
}

module.exports = DiscountService