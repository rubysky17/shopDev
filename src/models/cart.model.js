const { Schema, model } = require("mongoose");

const COLLECTION_NAME = "Carts";
const DOCUMENT_NAME = "Cart";

let cartschema = new Schema(
    {
        cart_state: {
            type: String,
            required: true,
            enum: ['active', 'complete', 'failed', 'pending'],
            default: "active"
        },
        cart_products: {
            type: Array,
            required: true,
            default: []
        },
        /* 
            [
                {
                    productId,
                    shopId,
                    quantiy,
                    name,
                    price,
                }
            ]
        */
        cart_count_product: {
            type: Number,
            default: 0,
        },
        cart_userId: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: {
            createdAt: 'createdOn',
            updatedAt: "modifiedOn"
        },
        collection: COLLECTION_NAME,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, cartschema);
