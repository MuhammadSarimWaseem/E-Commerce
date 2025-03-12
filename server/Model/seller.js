const mongoose = require('mongoose')

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    contact_no: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
})

const sellerModel = new mongoose.model("seller", sellerSchema)

module.exports = sellerModel;