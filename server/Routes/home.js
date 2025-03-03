const express = require('express')
const cookieParser = require('cookie-parser')
const router = express.Router()

//Middlewares
router.use(express.urlencoded({ extended: 'false' }))
router.use(cookieParser())

router.get('/home', (req, res) => {
    const token = ""
    res.cookie("token", "")
    res.status(201).json({ message: "Token removed", token });
})

module.exports = router