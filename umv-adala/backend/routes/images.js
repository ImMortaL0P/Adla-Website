const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Image = require('../models/Image');
const auth = require('../middleware/auth');
const { uploadImageToDrive, deleteFromDrive } = require('../lib/drive');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Get all images
router.get('/', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Upload image (Protected)
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { key, label, category } = req.body;
    
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    
    const existing = await Image.findOne({ key });
    if (existing && category === 'system') {
      if (existing.driveFileId) {
        try { await deleteFromDrive(existing.driveFileId); } catch(e) { console.error('Failed to delete old image from drive', e); }
      }
      await Image.findByIdAndDelete(existing._id);
    } else if (existing) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Image key already exists' });
    }

    const driveData = await uploadImageToDrive(req.file.path, req.file.originalname, req.file.mimetype);
    
    fs.unlinkSync(req.file.path);

    const newImage = new Image({ 
      key, 
      label, 
      category, 
      driveFileId: driveData.driveFileId, 
      url: driveData.image_url 
    });
    
    await newImage.save();
    res.json(newImage);
  } catch (err) {
    console.error(err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: err.message || 'Server Error' });
  }
});

// Delete image (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const img = await Image.findById(req.params.id);
    if (!img) return res.status(404).json({ message: 'Image not found' });

    if (img.driveFileId) {
      try { await deleteFromDrive(img.driveFileId); } catch(e) { console.error('Failed to delete from drive', e); }
    }
    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
