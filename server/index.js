const express = require('express');
const cors = require('cors');
const db = require("./Config/db");

const loginRoute = require("./Routes/login");

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


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));