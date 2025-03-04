const express = require('express');
const cors = require('cors');
const db = require("./Config/db");

const loginRoute = require("./Routes/login");
const signupRoute = require("./Routes/signup");
const logoutRoute = require("./Routes/logout");
const homeRoute = require("./Routes/home");
const userRoleRoute = require("./Routes/userRole");
const landingRoute = require("./Routes/landing");
const addProductRoute = require("./Routes/addProduct");

const app = express();
const PORT = 8000;

app.use(cors({
  origin: ["http://localhost:5173", "https://your-deployed-site.com"],
  credentials: true
}));

// Middleware
app.use(express.json()); // For JSON data
app.use(express.urlencoded({ extended: true })); // For form data

app.use("/", loginRoute);
app.use("/", signupRoute);
app.use("/", logoutRoute);
app.use("/", homeRoute);
app.use("/", userRoleRoute);
app.use("/", landingRoute);
app.use("/", addProductRoute);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));