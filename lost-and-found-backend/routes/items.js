const express = require("express");
const multer = require("multer");
const Item = require("../models/Item");

const router = express.Router();
const uploads = multer({ dest: "uploads/" });

// Route to upload lost or found items
router.post("/uploads", uploads.single("image"), async (req, res) => {
  console.log("Request received:", req.body);
  try {
    const { title, description, contact, status } = req.body;
    
    const newItem = new Item({
      title,
      description,
      contact,
      status,
      image: req.file ? `uploads/${req.file.filename}` : null, // Store full image path
    });
    
    await newItem.save();
    res.status(201).json(newItem); // Respond with created item and status 201
  } catch (error) {
    console.error("Failed to upload item:", error); // Log error for debugging
    res.status(500).json({ message: "Failed to upload item." });
  }
});

// Get all items by status
router.get("/:status", async (req, res) => {
  try {
    const items = await Item.find({ status: req.params.status, isResolved: false });
    res.json(items);
  } catch (error) {
    console.error("Failed to retrieve items:", error); // Log error for debugging
    res.status(500).json({ message: "Failed to retrieve items." });
  }
});

// Mark item as resolved
router.patch("/:id/resolve", async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, { isResolved: true }, { new: true }); // Get the updated item back
    
    if (!item) {
      return res.status(404).json({ message: "Item not found." }); // Handle not found
    }
    
    res.json({ message: "Item marked as resolved.", item }); // Respond with updated item
  } catch (error) {
    console.error("Failed to resolve item:", error); // Log error for debugging
    res.status(500).json({ message: "Failed to resolve item." });
  }
});

module.exports = router;
