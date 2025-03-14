const express = require("express");
const router = express.Router();
const Order = require("../Model/order");
const jwt = require('jsonwebtoken')

// Admin - Get all orders
router.get("/adminOrders", verifyToken, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find().populate("products.product");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
});

router.put("/adminOrders/:orderId", verifyToken, isAdmin, async (req, res) => {
    try {
        const { orderStatus } = req.body;
        
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.orderId,
            { $set: { orderStatus } }, // ✅ Only update orderStatus
            { new: true } // ✅ Return the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: "Order status updated successfully", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Error updating order status" });
    }
});



function verifyToken  (req, res, next) {
    console.log("Cookies received:", req.cookies); // Debugging

    const token = req.cookies?.token; // Ensure token exists in cookies
    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided!" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message); // Debugging
        res.status(400).json({ message: "Invalid Token" });
    }
};

function isAdmin  (req, res, next) {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Access Denied: Admins Only" });
    }
    next();
};

module.exports = router;