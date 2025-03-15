const express = require("express");
const jwt = require("jsonwebtoken");
const userModel = require("../Model/user");
const productModel = require("../Model/product");
const orderModel = require("../Model/order");
const cookieParser = require("cookie-parser");

const router = express.Router();
router.use(cookieParser());
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post("/order", isloggedIn, async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging

        // Validate shipping details
        const { customerName, contactDetails, shippingAddress } = req.body.shippingDetails || {};
        
        if (!customerName || !contactDetails || !contactDetails.phone || !shippingAddress ||
            !shippingAddress.street1 || !shippingAddress.city || 
            !shippingAddress.country || !shippingAddress.zipCode) {
            return res.status(400).send({ error: "All required shipping details must be provided!" });
        }

        // Fetch User
        let user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        let cartValue = req.body.cart || [];

        // Validate cart
        if (!Array.isArray(cartValue) || cartValue.length === 0) {
            return res.status(400).send({ error: "Cart is empty or invalid!", receivedData: req.body });
        }

        let productIds = cartValue.map(item => item._id);
        
        // Fetch all products in a single query
        let products = await productModel.find({ _id: { $in: productIds } });

        let orderItems = cartValue.map(item => {
            let product = products.find(p => p._id.toString() === item._id);
            return {
                product: product._id,
                quantity: item.quantity || 1,
                profit: item.profit // Include profit information
            };
        });

        // Save order
        let order = await orderModel.create({
            user: user._id,
            products: orderItems,
            customerName,
            contactDetails: {
                phone: contactDetails.phone,
                email: contactDetails.email || null // Optional field
            },
            shippingAddress: {
                street1: shippingAddress.street1,
                street2: shippingAddress.street2 || null, // Optional field
                city: shippingAddress.city,
                country: shippingAddress.country,
                zipCode: shippingAddress.zipCode
            }
        });

        res.status(201).send({ message: "Order placed successfully!", order });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error creating order" });
    }
});

// Middleware to check if the user is logged in
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