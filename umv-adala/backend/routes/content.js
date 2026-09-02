const express = require('express');
const Content = require('../models/Content');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all content
router.get('/', async (req, res) => {
  try {
    const content = await Content.find();
    res.json(content);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update or create content (Protected)
router.post('/', auth, async (req, res) => {
  try {
    const { key, value_en, value_hi } = req.body;
    let content = await Content.findOne({ key });
    
    if (content) {
      content.value_en = value_en;
      content.value_hi = value_hi;
      await content.save();
    } else {
      content = new Content({ key, value_en, value_hi });
      await content.save();
    }
    res.json(content);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
