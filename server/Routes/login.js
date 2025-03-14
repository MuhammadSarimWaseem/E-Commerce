const express = require('express')
const cookieParser = require('cookie-parser')
const userModel = require('../Model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
require("dotenv").config();

//Middlewares
router.use(express.urlencoded({ extended: 'false' }))
router.use(cookieParser())

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const token = jwt.sign(
            { email: user.email, userid: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        console.log("Token sent in cookie:", token);
        console.log("Cookies after login:", req.cookies);

        res.cookie("token", token, {path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "None" });
        
        return res.status(200).json({ message: "Login successful!", token });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router