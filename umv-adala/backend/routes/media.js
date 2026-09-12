const express = require('express');
const { streamDriveFile } = require('../lib/drive');
const { decryptId } = require('../lib/cryptoHelper');

const router = express.Router();

router.get('/img/:hash', async (req, res) => {
  try {
    const fileId = decryptId(req.params.hash);
    if (!fileId) {
      return res.status(400).json({ message: 'Invalid media hash' });
    }
    const acceptsWebp = req.headers.accept?.includes('image/webp');
    await streamDriveFile(fileId, res, { acceptsWebp, width: req.query.w });
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).json({ message: 'Server Error' });
  }
});

// Legacy backward-compatibility for non-hashed images if needed, or attachments
router.get('/:fileId', async (req, res) => {
  try {
    const acceptsWebp = req.headers.accept?.includes('image/webp');
    await streamDriveFile(req.params.fileId, res, { acceptsWebp, width: req.query.w });
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
