const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const GalleryImage = require('../models/GalleryImage');
const GalleryCategory = require('../models/GalleryCategory');
const auth = require('../middleware/auth');
const { uploadImageToDrive, deleteFromDrive, usesOAuth, getGalleryFolderId } = require('../lib/drive');

const router = express.Router();

const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed.'));
    }
  },
});

function cleanupTempFile(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

router.get('/', async (_req, res) => {
  try {
    const images = await GalleryImage.find({ is_published: true }).sort({ display_order: 1, created_at: -1 });
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get categories
router.get('/categories', async (_req, res) => {
  try {
    const existingImagesCats = await GalleryImage.distinct('category');
    const customCats = await GalleryCategory.find();

    const catMap = new Map();

    // add from images
    existingImagesCats.forEach(val => {
      catMap.set(val, {
        value: val,
        label_en: val.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        label_hi: val.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      });
    });

    // add from custom
    customCats.forEach(c => {
      catMap.set(c.value, {
        value: c.value,
        label_en: c.label_en,
        label_hi: c.label_hi
      });
    });

    res.json(Array.from(catMap.values()).sort((a,b) => a.value.localeCompare(b.value)));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create category
router.post('/categories', auth, async (req, res) => {
  try {
    const { label_en, label_hi } = req.body;
    if (!label_en) {
      return res.status(400).json({ message: 'Category English name is required' });
    }
    const value = label_en.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    let cat = await GalleryCategory.findOne({ value });
    if (!cat) {
      cat = await GalleryCategory.create({
        value,
        label_en,
        label_hi: label_hi || label_en
      });
    }
    res.json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', auth, (req, res, next) => {
  upload.array('images', 20)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'One or more images are too large. Maximum size is 8 MB per file.' });
      }
      return res.status(400).json({ message: err.message });
    }
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { caption_en, caption_hi, category, taken_on, event_name_en, event_name_hi, event_date, event_description_en, event_description_hi } = req.body;

    if (!caption_en) {
      if (req.files) req.files.forEach(f => cleanupTempFile(f.path));
      return res.status(400).json({ message: 'English caption is required.' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Image files are required.' });
    }
    if (!getGalleryFolderId()) {
      req.files.forEach(f => cleanupTempFile(f.path));
      return res.status(503).json({ message: 'DRIVE_GALLERY_FOLDER_ID or DRIVE_FOLDER_ID is not set.' });
    }
    if (!usesOAuth()) {
      req.files.forEach(f => cleanupTempFile(f.path));
      return res.status(503).json({
        message: 'Gallery uploads need OAuth. Run: node scripts/get-oauth-token.js',
      });
    }

    const maxOrder = await GalleryImage.findOne().sort({ display_order: -1 }).select('display_order');
    let display_order = (maxOrder?.display_order ?? 0);

    const uploads = [];
    for (const file of req.files) {
      try {
        const uploaded = await uploadImageToDrive(file.path, file.originalname, file.mimetype);
        cleanupTempFile(file.path);

        display_order += 1;

        const image = await GalleryImage.create({
          caption_en,
          caption_hi,
          category: category || 'campus',
          event_name_en: event_name_en || undefined,
          event_name_hi: event_name_hi || undefined,
          event_date: event_date || undefined,
          event_description_en: event_description_en || undefined,
          event_description_hi: event_description_hi || undefined,
          image_url: uploaded.image_url,
          thumbnail_url: uploaded.thumbnail_url,
          driveFileId: uploaded.driveFileId,
          taken_on: taken_on || undefined,
          display_order,
          is_published: true,
        });

        uploads.push(image);
      } catch (err) {
        console.error("Failed to upload a file:", err);
        cleanupTempFile(file.path);
      }
    }

    if (uploads.length === 0) {
       return res.status(500).json({ message: 'Failed to upload images' });
    }

    res.json({ message: 'Images uploaded successfully', images: uploads });
  } catch (err) {
    console.error(err);
    if (req.files) req.files.forEach(f => cleanupTempFile(f.path));
    res.status(500).json({ message: err.message || 'Server Error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    if (image.driveFileId) {
      try {
        await deleteFromDrive(image.driveFileId);
      } catch (e) {
        console.error('Failed to delete gallery image from Drive:', e.message);
      }
    }

    await GalleryImage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
