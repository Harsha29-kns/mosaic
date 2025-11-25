const express = require('express');
const router = express.Router();
const Wish = require('../models/Wish');
const { upload } = require('../config/cloudinary');

// GET approved wishes
router.get('/', async (req, res) => {
  try {
    const wishes = await Wish.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(wishes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL wishes (For Admin Moderation)
router.get('/admin/all', async (req, res) => {
  try {
    const wishes = await Wish.find().sort({ createdAt: -1 });
    res.json(wishes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new wish (The Rocket Launch!)
router.post('/', upload.single('media'), async (req, res) => {
  try {
    const { author, message } = req.body;
    let mediaUrl = null;
    let mediaType = 'none';

    if (req.file) {
      mediaUrl = req.file.path;
      mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    }

    // Auto-approve for now (change to false if you want moderation)
    const newWish = new Wish({ 
      author, 
      message, 
      mediaUrl, 
      mediaType, 
      isApproved: true 
    });

    await newWish.save();
    res.status(201).json(newWish);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (Approve a wish - Admin)
router.put('/:id/approve', async (req, res) => {
  try {
    const wish = await Wish.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(wish);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (Like a wish)
router.put('/:id/like', async (req, res) => {
  try {
    const wish = await Wish.findByIdAndUpdate(req.params.id, { $inc: { reactions: 1 } }, { new: true });
    res.json(wish);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;