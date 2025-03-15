const express = require("express");
const cookieParser = require("cookie-parser");
const sellerModel = require("../Model/seller");
require("dotenv").config();

const router = express.Router();

// Middlewares
router.use(express.json());
router.use(cookieParser());

router.post("/addSeller", async (req, res) => {
    try {
        const { name, contactDetails, shippingAddress } = req.body;

        if (!name || !contactDetails?.phone || !shippingAddress?.street1 || !shippingAddress?.city || !shippingAddress?.country || !shippingAddress?.zipCode) {
            return res.status(400).json({ error: "All required fields must be filled." });
        }

        // Check if seller already exists based on contact number
        const existingSeller = await sellerModel.findOne({ "contactDetails.phone": contactDetails.phone });
        if (existingSeller) {
            return res.status(400).json({ error: "Seller with this contact number already exists." });
        }

        // Create a new seller
        const seller = await sellerModel.create({ name, contactDetails, shippingAddress });

        res.status(201).json({
            message: "Seller added successfully",
            seller
        });
    } catch (err) {
        console.error("Error adding seller:", err);
        res.status(500).json({ error: "An error occurred while creating the seller." });
    }
});

router.get("/sellers", async (req, res) => {
    try {
        const sellers = await sellerModel.find();
        res.status(200).json(sellers);
    } catch (err) {
        console.error("Error fetching sellers:", err);
        res.status(500).json({ error: "An error occurred while retrieving sellers." });
    }
});

module.exports = router;
