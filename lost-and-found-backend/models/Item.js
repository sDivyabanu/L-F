const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    contact: { type: String, required: true },
    image: { type: String, required: true },
    isFound: { type: Boolean, default: false },
    status: { type: String, required: true } // Ensure this is required
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
