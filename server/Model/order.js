const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    customerName: {
        type: String,
        required: true
    },
    contactDetails: {
        type: String,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;
