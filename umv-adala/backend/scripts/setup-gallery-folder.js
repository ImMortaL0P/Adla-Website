#!/usr/bin/env node
/**
 * Creates a "Gallery" subfolder inside DRIVE_FOLDER_ID (if DRIVE_GALLERY_FOLDER_ID is not set).
 * Prints the folder ID to add to .env as DRIVE_GALLERY_FOLDER_ID.
 */
require('dotenv').config();
const { getDriveService, usesOAuth, getGalleryFolderId } = require('../lib/drive');

const FOLDER_NAME = 'UMV Adala Gallery';

async function findOrCreateGalleryFolder(drive, parentId) {
  const query = `'${parentId}' in parents and name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const existing = await drive.files.list({
    q: query,
    fields: 'files(id,name)',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  if (existing.data.files?.length) {
    return existing.data.files[0];
  }

  const created = await drive.files.create({
    requestBody: {
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id,name',
    supportsAllDrives: true,
  });

  return created.data;
}

async function main() {
  if (!usesOAuth()) {
    console.error('OAuth is required. Run: npm run get-oauth-token');
    process.exit(1);
  }

  if (process.env.DRIVE_GALLERY_FOLDER_ID) {
    console.log('DRIVE_GALLERY_FOLDER_ID is already set:', process.env.DRIVE_GALLERY_FOLDER_ID);
    process.exit(0);
  }

  const parentId = process.env.DRIVE_FOLDER_ID;
  if (!parentId) {
    console.error('Set DRIVE_FOLDER_ID in .env first.');
    process.exit(1);
  }

  const drive = await getDriveService();
  const folder = await findOrCreateGalleryFolder(drive, parentId);

  console.log(`\nGallery folder ready: ${folder.name}`);
  console.log(`\nAdd this to umv-adala/backend/.env:\n`);
  console.log(`DRIVE_GALLERY_FOLDER_ID=${folder.id}`);
  console.log('\nThen restart the backend.\n');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
