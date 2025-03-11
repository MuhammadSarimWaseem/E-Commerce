const express = require("express");
const cookieParser = require("cookie-parser");
const productModel = require("../Model/product");
const cron = require("node-cron");

const router = express.Router();

router.use(express.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(express.json());

// Middleware to delete old products before responding
const deleteOldProducts = async (req, res, next) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Delete products older than 7 days
        await productModel.deleteMany({ date: { $lt: sevenDaysAgo } });
        next(); // Proceed to the next middleware (fetching products)
    } catch (error) {
        console.error("Error deleting old products:", error);
        return res.status(500).json({ success: false, message: "Error cleaning up old products", error: error.message });
    }
};

// Fetch all products (Deletes old ones first)
router.get("/products", deleteOldProducts, async (req, res) => {
    try {
        const products = await productModel.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching products", error: error.message });
    }
});

// Cron Job to Delete Old Products (Runs every midnight)
cron.schedule("0 0 * * *", async () => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Delete products older than 7 days
        const result = await productModel.deleteMany({ date: { $lt: sevenDaysAgo } });
        console.log(`${result.deletedCount} old products removed.`);
    } catch (error) {
        console.error("Error deleting old products:", error);
    }
});

module.exports = router;
