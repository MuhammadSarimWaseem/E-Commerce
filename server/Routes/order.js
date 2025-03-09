const express = require("express");
const jwt = require("jsonwebtoken"); 
const userModel = require("../Model/user");
const productModel = require("../Model/product");
const orderModel = require("../Model/order");  // Import Order Model
const cookieParser = require("cookie-parser");

const router = express.Router();
router.use(cookieParser());
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post("/order", isloggedIn, async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging

        let user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        let cartValue = req.body.cartValue || req.body;

        if (!Array.isArray(cartValue) || cartValue.length === 0) {
            return res.status(400).send({ error: "Invalid cart data", receivedData: req.body });
        }

        let orderItems = [];

        for (let item of cartValue) {
            let existingProduct = await productModel.findById(item._id);
            
            if (!existingProduct) {
                return res.status(400).send({ error: `Product not found: ${item.title}` });
            }

            orderItems.push({
                product: existingProduct._id,
                quantity: item.quantity || 1 // Default quantity = 1
            });
        }

        // Save order
        let order = await orderModel.create({
            user: user._id,
            products: orderItems
        });

        res.status(201).send({ message: "Order placed successfully", order });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error creating order" });
    }
});

function isloggedIn(req, res, next) {
    try {
        if (!req.cookies.token) {
            return res.status(401).json({ error: "Unauthorized! Please log in." });
        }

        let data = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        req.user = data;

        next();
    } catch (err) {
        console.error("JWT Verification Error:", err);
        return res.status(401).json({ error: "Invalid token! Please log in again." });
    }
}

module.exports = router;
