const express = require('express')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const router = express.Router()
require("dotenv").config();

router.use(express.urlencoded({ extended: 'false' }))
router.use(cookieParser())

router.get('/landing', isLoggedIn, (req, res) => {
  res.status(200).json({ message: "Welcome to the landing page!", user: req.user });
});

function isLoggedIn(req, res, next) {
  const token = req.cookies.token; // Extract token from cookies

  if (!token) {
    return res.status(401).json({ error: "Please login first!" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = data; // Attach user info to the request
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token!" });
  }
}

module.exports = router