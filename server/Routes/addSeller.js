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
        const { name, address, contact_no } = req.body;

        if (!name || !address || !contact_no) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if seller already exists
        const existingSeller = await sellerModel.findOne({ address });
        if (existingSeller) {
            return res.status(400).json({ error: "Seller with this address already exists." });
        }

        // Create a new seller
        const seller = await sellerModel.create({ name, address, contact_no });

        res.status(201).json({
            message: "Seller added successfully",
            seller: { id: seller._id, name: seller.name, address: seller.address, contact_no: seller.contact_no },
        });

    } catch (err) {
        console.error("Error adding seller:", err);
        res.status(500).json({ error: "An error occurred while creating the seller." });
    }
});

module.exports = router;
