const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['seller', 'admin'],
        default: 'seller'
    },
    date: {
        type: Date,
        default: Date.now
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "order"
    }]
})

const userModel = new mongoose.model("user", userSchema)

module.exports = userModel;