const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const Notice = require('../models/Notice');
const auth = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Initialize Google Drive API
const getDriveService = () => {
  if (!fs.existsSync('service-account.json')) {
    console.warn("No service-account.json found. Drive uploads will fail.");
    return null;
  }
  const auth = new google.auth.GoogleAuth({
    keyFile: 'service-account.json',
    scopes: ['https://www.googleapis.com/auth/drive']
  });
  return google.drive({ version: 'v3', auth });
};

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

// Upload and create notice (Protected)
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { title_en, title_hi, body_en, body_hi, type } = req.body;
    let driveFileId = null;
    let attachment_url = null;

    if (req.file) {
      const drive = getDriveService();
      if (!drive) {
        fs.unlinkSync(req.file.path);
        return res.status(500).json({ message: 'Google Drive is not configured on the server.' });
      }

      // We need a specific folder ID in Drive or it goes to root.
      const folderId = process.env.DRIVE_FOLDER_ID; 

      const fileMetadata = {
        name: req.file.originalname,
        parents: folderId ? [folderId] : []
      };
      const media = {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path)
      };

      const file = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      });
      driveFileId = file.data.id;

      // Make the file public so anyone can view/download it
      await drive.permissions.create({
        fileId: driveFileId,
        requestBody: { role: 'reader', type: 'anyone' }
      });

      attachment_url = `https://drive.google.com/file/d/${driveFileId}/view?usp=sharing`;
      
      // Clean up local temp file
      fs.unlinkSync(req.file.path);
    }

    // Generate unique slug
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
      attachment_url
    });

    await newNotice.save();
    res.json(newNotice);
  } catch (err) {
    console.error(err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).send('Server Error');
  }
});

// Delete notice (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    if (notice.driveFileId) {
      const drive = getDriveService();
      if (drive) {
        try {
          await drive.files.delete({ fileId: notice.driveFileId });
        } catch (e) {
          console.error("Failed to delete file from drive, maybe already deleted", e);
        }
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
