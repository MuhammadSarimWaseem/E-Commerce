const mongoose = require('mongoose')

const sellerSchema = new mongoose.Schema({
    name: {
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
    date: {
        type: Date,
        default: Date.now
    },
})

const sellerModel = new mongoose.model("seller", sellerSchema)

module.exports = sellerModel;