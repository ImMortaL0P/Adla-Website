require('dotenv').config();
const mongoose = require('mongoose');
const sharp = require('sharp');
const GalleryImage = require('../models/GalleryImage');
const Staff = require('../models/Staff');
const { getDriveService } = require('../lib/drive');
const stream = require('stream');

async function checkAndCompressFile(drive, fileId, label) {
  try {
    const meta = await drive.files.get({ fileId, fields: 'size, mimeType', supportsAllDrives: true });
    const size = parseInt(meta.data.size || '0', 10);
    const mimeType = meta.data.mimeType;
    
    if (!mimeType.startsWith('image/')) return;
    if (mimeType === 'image/gif' || mimeType === 'image/svg+xml' || mimeType === 'image/webp') {
        if(size < 1024 * 1024) return; // if it's a huge webp, we can still re-compress
    }
    
    if (size < 400 * 1024 && mimeType === 'image/webp') {
      // already good
      return;
    }
    
    // We want to compress ALL heavy images (even JPEG around 300KB can be brought down to 80KB WebP)
    // But let's compress everything over 300KB. Or just compress all non-WebP files!
    if (size < 200 * 1024 && mimeType === 'image/webp') {
      console.log(`[SKIP] ${label} file ${fileId} is already optimized (${Math.round(size/1024)} KB)`);
      return;
    }

    console.log(`[FETCH] Downloading ${label} ${fileId} (${Math.round(size/1024/1024 * 100)/100} MB)...`);
    
    const res = await drive.files.get({ fileId, alt: 'media', supportsAllDrives: true }, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(res.data);
    
    console.log(`[COMPRESSING] ${fileId}...`);
    // Convert to webp max 1600 width, high compression
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 75, effort: 4 })
      .toBuffer();
      
    if (optimizedBuffer.length > size * 0.95) {
       console.log(`[SKIP] Compressed size (${Math.round(optimizedBuffer.length/1024)} KB) is not significantly better. Preserving original.`);
       return;
    }
    
    console.log(`[UPLOAD] Uploading compressed replacement for ${fileId} (New size: ${Math.round(optimizedBuffer.length/1024)} KB)...`);
    
    const bufferStream = new stream.PassThrough();
    bufferStream.end(optimizedBuffer);
    
    await drive.files.update({
      fileId,
      supportsAllDrives: true,
      media: {
        mimeType: 'image/webp',
        body: bufferStream
      }
    }); // update without removing fields replaces the content but keeps metadata
    
    console.log(`[SUCCESS] File ${fileId} completely replaced!`);
  } catch (err) {
    if (err.message.includes('404')) {
        console.warn(`[WARN] File ${fileId} not found in drive.`);
    } else {
        console.error(`[ERROR] File ${fileId}:`, err.message);
    }
  }
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/umv-adala');
    console.log('Connected to DB');
    
    const drive = await getDriveService();
    if (!drive) {
      console.error('Drive service not initialized');
      process.exit(1);
    }
    
    const images = await GalleryImage.find();
    console.log(`Found ${images.length} gallery images in DB.`);
    
    for (const img of images) {
      if (img.driveFileId) {
        await checkAndCompressFile(drive, img.driveFileId, 'GalleryImage');
      }
    }
    
    const staff = await Staff.find();
    console.log(`Found ${staff.length} staff records in DB.`);
    for (const s of staff) {
      if (s.driveFileId) {
        await checkAndCompressFile(drive, s.driveFileId, 'StaffProfile');
      }
    }
    
    console.log('Finished processing all images.');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();
