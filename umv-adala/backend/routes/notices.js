const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Notice = require('../models/Notice');
const auth = require('../middleware/auth');
const { uploadToDrive, deleteFromDrive, isDriveConfigured, usesOAuth } = require('../lib/drive');

const router = express.Router();

const ALLOWED_MIMES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, Word (.doc/.docx), and image files (JPEG, PNG, WebP) are allowed.'));
    }
  },
});

function cleanupTempFile(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

// Get all notices (Public)
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find({ is_published: true }).sort({ published_at: -1 });
    res.json(notices);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get single notice by slug (Public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const notice = await Notice.findOne({ slug: req.params.slug, is_published: true });
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Upload and create notice (Protected)
router.post('/', auth, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File is too large. Maximum size is 10 MB.' });
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
    const { title_en, title_hi, body_en, body_hi, type } = req.body;
    let driveFileId = null;
    let attachment_url = null;
    let attachment_download_url = null;
    let attachment_filename = null;

    if (req.file) {
      if (!isDriveConfigured()) {
        cleanupTempFile(req.file.path);
        return res.status(503).json({
          message: 'Google Drive is not configured. Set DRIVE_FOLDER_ID and OAuth credentials on the server.',
        });
      }

      if (!usesOAuth()) {
        cleanupTempFile(req.file.path);
        return res.status(503).json({
          message:
            'Drive uploads need OAuth for personal Google accounts. In umv-adala/backend run: node scripts/get-oauth-token.js',
        });
      }

      const uploaded = await uploadToDrive(req.file.path, req.file.originalname, req.file.mimetype);
      driveFileId = uploaded.driveFileId;
      attachment_url = uploaded.attachment_url;
      attachment_download_url = uploaded.attachment_download_url;
      attachment_filename = req.file.originalname;
      cleanupTempFile(req.file.path);
    }

    const slugBase = title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = slugBase;
    let counter = 1;
    while (await Notice.findOne({ slug })) {
      slug = `${slugBase}-${counter}`;
      counter++;
    }

    const newNotice = new Notice({
      slug,
      title_en,
      title_hi,
      body_en,
      body_hi,
      type,
      driveFileId,
      attachment_url,
      attachment_download_url,
      attachment_filename,
    });

    await newNotice.save();
    res.json(newNotice);
  } catch (err) {
    console.error(err);
    cleanupTempFile(req.file?.path);
    res.status(500).json({ message: err.message || 'Server Error' });
  }
});

// Delete notice (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    if (notice.driveFileId) {
      try {
        await deleteFromDrive(notice.driveFileId);
      } catch (e) {
        console.error('Failed to delete file from Drive (may already be removed):', e.message);
      }
    }

    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
