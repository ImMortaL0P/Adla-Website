require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const noticeRoutes = require('./routes/notices');
const galleryRoutes = require('./routes/gallery');
const imageRoutes = require('./routes/images');
const staffRoutes = require('./routes/staff');
const contentRoutes = require('./routes/content');
const { verifyDriveAccess, verifyGalleryAccess } = require('./lib/drive');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  const drive = await verifyDriveAccess();
  const gallery = await verifyGalleryAccess();
  res.json({ status: 'ok', drive, gallery });
});

app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/content', contentRoutes);

// --- Serve React Frontend in Production ---
const path = require('path');
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Catch-all to serve index.html for client-side routing. A bare '*' path
// crashes on startup under Express 5 / path-to-regexp v7+ ("Missing
// parameter name at index 1") — a path-less app.use() matches everything
// that reaches it without going through route-pattern parsing at all.
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/umv-adala')
  .then(async () => {
    console.log('Connected to MongoDB');

    const drive = await verifyDriveAccess();
    const gallery = await verifyGalleryAccess();
    if (drive.ok) {
      console.log(`Google Drive ready (notices folder: ${drive.folderName})`);
    } else {
      console.warn(`Google Drive not ready: ${drive.error}`);
    }
    if (gallery.ok) {
      console.log(`Gallery Drive ready (folder: ${gallery.folderName})`);
    } else {
      console.warn(`Gallery Drive not ready: ${gallery.error}`);
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
