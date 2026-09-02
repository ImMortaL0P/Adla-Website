const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const Image = require('../models/Image');
const auth = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const getDriveService = () => {
  if (!fs.existsSync('service-account.json')) return null;
  const auth = new google.auth.GoogleAuth({
    keyFile: 'service-account.json',
    scopes: ['https://www.googleapis.com/auth/drive']
  });
  return google.drive({ version: 'v3', auth });
};

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
    
    // Check if key already exists, we will replace it later or reject
    const existing = await Image.findOne({ key });
    if (existing && category === 'system') {
      // For system images (hero, about), we might want to delete the old one from drive first
      const drive = getDriveService();
      if (drive && existing.driveFileId) {
        try { await drive.files.delete({ fileId: existing.driveFileId }); } catch(e) {}
      }
      await Image.findByIdAndDelete(existing._id);
    } else if (existing) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Image key already exists' });
    }

    const drive = getDriveService();
    if (!drive) {
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ message: 'Drive not configured' });
    }

    const folderId = process.env.DRIVE_FOLDER_ID;
    const file = await drive.files.create({
      resource: { name: req.file.originalname, parents: folderId ? [folderId] : [] },
      media: { mimeType: req.file.mimetype, body: fs.createReadStream(req.file.path) },
      fields: 'id'
    });
    const driveFileId = file.data.id;

    await drive.permissions.create({
      fileId: driveFileId,
      requestBody: { role: 'reader', type: 'anyone' }
    });

    const url = `https://drive.google.com/uc?id=${driveFileId}`; // 'uc' is better for direct image rendering than 'view'
    
    fs.unlinkSync(req.file.path);

    const newImage = new Image({ key, label, category, driveFileId, url });
    await newImage.save();
    res.json(newImage);
  } catch (err) {
    console.error(err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).send('Server Error');
  }
});

// Delete image (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const img = await Image.findById(req.params.id);
    if (!img) return res.status(404).json({ message: 'Image not found' });

    const drive = getDriveService();
    if (drive && img.driveFileId) {
      try { await drive.files.delete({ fileId: img.driveFileId }); } catch(e) {}
    }
    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
