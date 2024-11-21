const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const itemsRoute = require("./routes/items");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve static files
app.use("/api/items", itemsRoute);

module.exports = app;
