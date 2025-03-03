const mongoose = require('mongoose')

const db = mongoose
    .connect("mongodb://localhost:27017/E-Commerce")
    .then(() => { console.log("Mongo connected") })
    .catch(() => { console.log("Connection error") })

module.exports = db