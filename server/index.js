const express = require('express');
const cors = require('cors');
const db = require("./Config/db");

const loginRoute = require("./Routes/login");
const signupRoute = require("./Routes/signup");
const logoutRoute = require("./Routes/logout");
const homeRoute = require("./Routes/home");
const userRoleRoute = require("./Routes/userRole");
const landingRoute = require("./Routes/landing");
const productRoute = require("./Routes/products");
const addProductRoute = require("./Routes/addProduct");
const order = require("./Routes/order");
const viewOrders = require("./Routes/viewOrders");
const addSeller = require("./Routes/addSeller");

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
app.use("/", productRoute);
app.use("/", addProductRoute);
app.use("/", order);
app.use("/", viewOrders);
app.use("/", addSeller);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));