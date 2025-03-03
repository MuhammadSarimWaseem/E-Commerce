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
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    course: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    }]

})

const userModel = new mongoose.model("user", userSchema)

module.exports = userModel;