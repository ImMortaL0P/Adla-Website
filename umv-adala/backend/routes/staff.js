const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Staff = require('../models/Staff');
const auth = require('../middleware/auth');
const { uploadImageToDrive, deleteFromDrive } = require('../lib/drive');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

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
      const driveData = await uploadImageToDrive(req.file.path, req.file.originalname, req.file.mimetype);
      driveFileId = driveData.driveFileId;
      imageUrl = driveData.image_url;
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
    res.status(500).json({ message: err.message || 'Server Error' });
  }
});

// Update staff (Protected)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    let staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Not found' });

    if (req.file) {
      if (staff.driveFileId) {
        try { await deleteFromDrive(staff.driveFileId); } catch(e) { console.error('Failed to delete old staff image from drive', e); }
      }
      const driveData = await uploadImageToDrive(req.file.path, req.file.originalname, req.file.mimetype);
      staff.driveFileId = driveData.driveFileId;
      staff.imageUrl = driveData.image_url;
      fs.unlinkSync(req.file.path);
    }

    Object.assign(staff, data);
    await staff.save();
    res.json(staff);
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: err.message || 'Server Error' });
  }
});

// Delete staff (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Not found' });

    if (staff.driveFileId) {
      try { await deleteFromDrive(staff.driveFileId); } catch(e) { console.error('Failed to delete staff image from drive', e); }
    }
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: 'Removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
