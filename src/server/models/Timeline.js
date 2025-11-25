const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  year: { type: String, required: true }, // e.g., "2018" or "Childhood"
  title: { type: String, required: true },
  description: { type: String },
  photos: [{ type: String }], // Array of image URLs
  backgroundBlurImage: { type: String }, // The image used for the blur effect
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Timeline', timelineSchema);