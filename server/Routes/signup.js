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

router.post('/signup', async (req, res) => {
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
            return res.status(400).json({ error: "Password must be at least 6 characters long." })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({ name, email, password: hashedPassword, role });

        const token = jwt.sign({ email: user.email, userid: user._id }, process.env.JWT_SECRET);
        res.cookie("token", token);

        res.status(201).json({ message: "User created successfully", token: token });


        async function main(userEmail) {
            try {
                const info = await transporter.sendMail({
                    from: '"Your Name" <sarimwaseem84@gmail.com>', // Sender address
                    to: user.email, // Receiver's email address
                    subject: "Welcome!", // Email subject
                    text: "Welcome to our platform!", // Plain text body
                    html: "<b>Welcome to our platform!</b>", // HTML body
                });

                console.log("Message sent: %s", info.messageId);
            } catch (error) {
                console.error("Error sending email:", error);
            }
        }
        main();

    } catch (err) {
        res.status(500).json({ error: "An error occurred while creating the user." });
    }
});

module.exports = router