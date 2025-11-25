const express = require('express');
const router = express.Router();
const Mosaic = require('../models/Mosaic');
const { cloudinary } = require('../config/cloudinary');

// GET the latest mosaic (For User View)
router.get('/', async (req, res) => {
  try {
    const mosaic = await Mosaic.findOne().sort({ createdAt: -1 });
    res.json(mosaic);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST (Save generated mosaic)
// Since the canvas gives us a Base64 Data URL, we need to upload that differently
router.post('/', async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) return res.status(400).json({ error: 'No image data' });

    // Upload Base64 directly to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
      folder: 'birthday-mosaics',
    });

    const newMosaic = new Mosaic({ imageUrl: uploadResponse.secure_url });
    await newMosaic.save();

    res.status(201).json(newMosaic);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;