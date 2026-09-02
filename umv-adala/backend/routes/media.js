const express = require('express');
const { streamDriveFile } = require('../lib/drive');

const router = express.Router();

// Public — streams an uploaded image's bytes through our own authenticated
// Drive access, so every visitor gets it the same reliable way regardless
// of Google's public-thumbnail propagation state.
router.get('/:fileId', async (req, res) => {
  try {
    await streamDriveFile(req.params.fileId, res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
