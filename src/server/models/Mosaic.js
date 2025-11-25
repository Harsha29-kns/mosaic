const mongoose = require('mongoose');

const mosaicSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true }, // The final generated mosaic URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mosaic', mosaicSchema);