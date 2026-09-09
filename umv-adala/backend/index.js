require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const noticeRoutes = require('./routes/notices');
const galleryRoutes = require('./routes/gallery');
const imageRoutes = require('./routes/images');
const staffRoutes = require('./routes/staff');
const contentRoutes = require('./routes/content');
const mediaRoutes = require('./routes/media');
const { verifyDriveAccess, verifyGalleryAccess } = require('./lib/drive');

const app = express();

// 1. Set Security HTTP headers
app.use(helmet());

// 2. Restrict CORS Policy for APIs
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://umvadla.in', 'https://www.umvadla.in', 'https://admin.umvadla.in']
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 3. Body parsers with payload size limit
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// 4. Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// 5. Data sanitization against XSS
app.use(xss());

// 6. Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', globalLimiter);

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
app.use('/api/media', mediaRoutes);

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