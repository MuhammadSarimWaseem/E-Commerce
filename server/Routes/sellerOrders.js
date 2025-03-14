const express = require("express");
const router = express.Router();
const Order = require("../Model/order");
const jwt = require("jsonwebtoken");

// ✅ Seller - Get only their orders
router.get("/sellerOrders", verifyToken, async (req, res) => {
    try {
        const sellerId = req.user._id; // ✅ Now correctly retrieves ID
        console.log("Logged-in Seller ID:", sellerId); // Debugging

        if (!sellerId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const orders = await Order.find({ user: sellerId }).populate("products.product");

        console.log("Fetched Orders:", orders.length); // Debugging
        res.json(orders);
    } catch (error) {
        console.error("Error fetching seller orders:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

function verifyToken(req, res, next) {
    console.log("Cookies received:", req.cookies); // 🛠 Debugging

    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ error: "Please login first!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token Data:", decoded); // 🛠 Debugging

        req.user = { _id: decoded.userid, role: decoded.role }; // ✅ Extract user ID properly
        console.log("Verified User ID:", req.user._id);
        console.log("Verified Role:", req.user.role);
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        res.status(403).json({ message: "Invalid Token" });
    }
}

module.exports = router;
