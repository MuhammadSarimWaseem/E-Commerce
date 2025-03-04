require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const productModel = require("../Model/product");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage (Handles Both Images & Videos)
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        let folder = "products/images";
        let resourceType = "image";

        return {
            folder,
            resource_type: resourceType,
            public_id: Date.now() + "-" + file.originalname,
        };
    },
});

// Configure Multer to accept both image and video
const upload = multer({ storage }).fields([
    { name: "image", maxCount: 1 }
]);

// Middlewares
router.use(express.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(express.json());

// Route to create product
router.post("/addProducts", upload, async (req, res) => {
    try {
        const { title, description, price } = req.body;
        if (!title || !description || !price) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const image = req.files?.image ? req.files.image[0].path : null;

        const product = await productModel.create({
            title,
            description,
            price,
            image,
        });

        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;