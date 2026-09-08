const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const { google } = require('googleapis');
const { uploadToDrive, buildAttachmentUrls, buildImageUrls } = require('../lib/drive');

const Notice = require('../models/Notice');
const Image = require('../models/Image');
const GalleryImage = require('../models/GalleryImage');
const Staff = require('../models/Staff');

const SYNC_MAP_FILE = path.join(__dirname, 'sync-map.json');
let syncMap = {};
if (fs.existsSync(SYNC_MAP_FILE)) {
  syncMap = JSON.parse(fs.readFileSync(SYNC_MAP_FILE, 'utf8'));
}

function saveSyncMap() {
  fs.writeFileSync(SYNC_MAP_FILE, JSON.stringify(syncMap, null, 2));
}

// Authenticate with Service Account for downloading original files
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '..', 'service-account.json'),
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});
const sourceDrive = google.drive({ version: 'v3', auth });

// Download from source drive using Service Account
async function downloadFile(fileId, destPath) {
  const fileMeta = await sourceDrive.files.get({ fileId, fields: 'mimeType' });
  const mimeType = fileMeta.data.mimeType;
  
  const dest = fs.createWriteStream(destPath);
  const response = await sourceDrive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  );

  return new Promise((resolve, reject) => {
    response.data
      .on('end', () => {
        resolve(mimeType);
      })
      .on('error', err => {
        reject(err);
      })
      .pipe(dest);
  });
}

async function syncDocument(doc, type) {
  if (!doc.driveFileId) return; // No file to sync

  const currentId = doc.driveFileId;

  if (Object.values(syncMap).includes(currentId)) {
    console.log(`[${type}] ${doc.id} already has a new drive file ID, skipping.`);
    return;
  }

  let newId = syncMap[currentId];

  const destFolder = type === 'GalleryImage'
    ? process.env.DRIVE_GALLERY_FOLDER_ID
    : (type === 'Notice' ? process.env.DRIVE_NOTICES_FOLDER_ID : process.env.DRIVE_FOLDER_ID);

  if (!newId) {
    const tempPath = path.join(__dirname, `temp_${currentId}`);
    try {
      console.log(`[${type}] Downloading old file ${currentId}...`);
      const mimeType = await downloadFile(currentId, tempPath);

      const originalName = doc.attachment_filename || doc.key || doc.caption_en || doc.title_en || 'SyncedFile';

      console.log(`[${type}] Uploading to new Drive folder ${destFolder}...`);
      const uploaded = await uploadToDrive(tempPath, originalName, mimeType, destFolder);
      newId = uploaded.driveFileId;

      syncMap[currentId] = newId;
      saveSyncMap();

      console.log(`[${type}] Uploaded successfully: new ID ${newId}`);
    } finally {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }

  // Update DB fields
  let updated = false;

  if (type === 'Notice') {
    doc.driveFileId = newId;
    const urls = buildAttachmentUrls(newId);
    doc.attachment_url = urls.attachment_url;
    doc.attachment_download_url = urls.attachment_download_url;
    updated = true;
  } else if (type === 'Image') {
    doc.driveFileId = newId;
    const urls = buildImageUrls(newId);
    doc.url = urls.image_url;
    updated = true;
  } else if (type === 'GalleryImage') {
    doc.driveFileId = newId;
    const urls = buildImageUrls(newId);
    doc.image_url = urls.image_url;
    doc.thumbnail_url = urls.thumbnail_url;
    updated = true;
  } else if (type === 'Staff') {
    doc.driveFileId = newId;
    const urls = buildImageUrls(newId);
    doc.imageUrl = urls.image_url;
    updated = true;
  }

  if (updated) {
    await doc.save();
    console.log(`[${type}] Updated DB for document ${doc.id}`);
  }
}

async function main() {
  console.log('Connecting to DB:', process.env.MONGODB_URI.split('@')[1]);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB!');

  console.log('Syncing Notices...');
  for (const doc of await Notice.find({})) await syncDocument(doc, 'Notice');

  console.log('Syncing Images...');
  for (const doc of await Image.find({})) await syncDocument(doc, 'Image');

  console.log('Syncing GalleryImages...');
  for (const doc of await GalleryImage.find({})) await syncDocument(doc, 'GalleryImage');

  console.log('Syncing Staff...');
  for (const doc of await Staff.find({})) await syncDocument(doc, 'Staff');

  console.log('All done!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
