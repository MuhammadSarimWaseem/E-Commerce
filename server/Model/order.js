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
            },
            profit:{
                type: Number,
                required: true
            },
        }
    ],
    customerName: {
        type: String,
        required: true
    },
    contactDetails: {
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: false
        }
    },
    shippingAddress: {
        street1: {
            type: String,
            required: true
        },
        street2: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        }
    },
    orderStatus: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
