const express = require('express')

const router = express.Router()
require("dotenv").config();

//Middlewares
router.use(express.urlencoded({ extended: 'false' }))

router.get('/viewOrders', async (req, res) => {
});

module.exports = router