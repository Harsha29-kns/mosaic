const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
  author: { type: String, required: true },
  message: { type: String, required: true },
  mediaUrl: { type: String }, // Optional photo/video
  mediaType: { type: String, enum: ['image', 'video', 'none'], default: 'none' },
  reactions: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false }, // Admin moderation
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wish', wishSchema);