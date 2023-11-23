const { Schema, model } = require("mongoose");

const COLLECTION_NAME = "Discounts";
const DOCUMENT_NAME = "Discount";

let discountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: 'fixed_amount' }, // Loại khuyến mãi có thể là giảm theo đơn hàng hay giảm theo %
    discount_value: { type: Number, required: true }, // Giá trị khuyến mãi
    discount_code: { type: String, required: true }, // Mã khuyến mãi : LOU82139 
    discount_start_date: { type: Date, required: true }, // Ngày bắt đầu
    discount_end_date: { type: Date, required: true }, // Ngày kết thúc
    discount_uses_count: { type: Number, required: true }, // Số lượng đã sử dụng
    discount_users_used: { type: Array, default: [] }, // UserID đã sử dụng discount
    discount_max_uses_per_user: { type: Number, required: true }, // Giới hạng discount sử dụng
    discount_min_order_value: { type: Number, required: true }, // Giá trị đơn hàng tối thiểu
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] },// áp dụng cho { toàn bộ sp hay 1 số SP}
    discount_product_ids: { type: Array, default: [] } // SP nào được áp dụng
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
