const express = require('express')
const cookieParser = require('cookie-parser')
const userModel = require('../Model/user')
const jwt = require('jsonwebtoken')
const router = express.Router()
require("dotenv").config();

//Middlewares
router.use(express.urlencoded({ extended: 'false' }))
router.use(cookieParser())

router.get('/userRole', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userid);

        if (!user) return res.status(401).json({ error: "User not found" });
        if (user.role === "admin") return res.json({ AddProducts: true });

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router