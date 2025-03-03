const express = require("express");
const cookieParser = require("cookie-parser");
const userModel = require("../Model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

// Middlewares
router.use(express.json());
router.use(cookieParser());

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use." });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({ name, email, password: hashedPassword, role });

        // Generate JWT with expiration
        const token = jwt.sign(
            { email: user.email, userid: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Set Secure HTTP-Only Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure only in production
            sameSite: "Strict",
        });

        res.status(201).json({
            message: "User created successfully",
            token: token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });

    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "An error occurred while creating the user." });
    }
});

module.exports = router;
