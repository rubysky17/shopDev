const { Schema, model } = require("mongoose");

const COLLECTION_NAME = "Orders";
const DOCUMENT_NAME = "Order";

let OrderSchema = new Schema(
    {
        order_userId: {
            type: Number,
            required: true
        },
        order_checkout: {
            type: Object,
            default: {}
        },
        /**
            order_checkout: {
                totalPrice,
                totalApplyDiscount,
                feeShip
            }
         */
        order_shipping: {
            type: Object,
            default: {}
        },
        /**
         order_shipping: {
                       street,
                       city,
                       state,
                   }
        */
        order_payment: {
            type: Object,
            default: {}
        },
        order_products: {
            type: Array,
            required: true
        },
        order_trackingNumber: {
            type: String,
            default: "#0001823612022" // example
        },
        order_status: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
            default: "pending"
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, OrderSchema);
