const express = require("express");
const cookieParser = require("cookie-parser");
const productModel = require("../Model/product")

const router = express.Router();

router.use(express.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(express.json());

router.get("/products", async (req, res) => {
    try {
        const products = await productModel.find()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching courses", error: error.message })
    }
});

module.exports = router;