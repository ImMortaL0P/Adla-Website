const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const Staff = require('../models/Staff');
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

// Get all staff
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find().sort({ order: 1 });
    res.json(staff);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add staff (Protected)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    let driveFileId = null;
    let imageUrl = null;

    if (req.file) {
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
      driveFileId = file.data.id;
      await drive.permissions.create({ fileId: driveFileId, requestBody: { role: 'reader', type: 'anyone' } });
      imageUrl = `https://drive.google.com/uc?id=${driveFileId}`;
      fs.unlinkSync(req.file.path);
    }

    const newStaff = new Staff({
      ...data,
      driveFileId,
      imageUrl
    });
    await newStaff.save();
    res.json(newStaff);
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).send('Server Error');
  }
});

// Update staff (Protected)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    let staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Not found' });

    if (req.file) {
      const drive = getDriveService();
      if (drive) {
        if (staff.driveFileId) {
          try { await drive.files.delete({ fileId: staff.driveFileId }); } catch(e) {}
        }
        const folderId = process.env.DRIVE_FOLDER_ID;
        const file = await drive.files.create({
          resource: { name: req.file.originalname, parents: folderId ? [folderId] : [] },
          media: { mimeType: req.file.mimetype, body: fs.createReadStream(req.file.path) },
          fields: 'id'
        });
        staff.driveFileId = file.data.id;
        await drive.permissions.create({ fileId: staff.driveFileId, requestBody: { role: 'reader', type: 'anyone' } });
        staff.imageUrl = `https://drive.google.com/uc?id=${staff.driveFileId}`;
      }
      fs.unlinkSync(req.file.path);
    }

    Object.assign(staff, data);
    await staff.save();
    res.json(staff);
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).send('Server Error');
  }
});

// Delete staff (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Not found' });

    if (staff.driveFileId) {
      const drive = getDriveService();
      if (drive) {
        try { await drive.files.delete({ fileId: staff.driveFileId }); } catch(e) {}
      }
    }
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: 'Removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
