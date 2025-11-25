const express = require('express');
const router = express.Router();
const Timeline = require('../models/Timeline');
const { upload } = require('../config/cloudinary');

// GET all timeline events (Sorted by Year)
router.get('/', async (req, res) => {
  try {
    const events = await Timeline.find().sort({ year: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new timeline event (Admin only - logic handled in frontend)
// Supports multiple photo uploads
router.post('/', upload.array('photos', 10), async (req, res) => {
  try {
    const { year, title, description } = req.body;
    const photoUrls = req.files.map(file => file.path);
    
    // Use the first photo as the background blur if not explicitly provided
    const backgroundBlurImage = photoUrls.length > 0 ? photoUrls[0] : null;

    const newEvent = new Timeline({
      year,
      title,
      description,
      photos: photoUrls,
      backgroundBlurImage
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a timeline event
router.delete('/:id', async (req, res) => {
  try {
    await Timeline.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;