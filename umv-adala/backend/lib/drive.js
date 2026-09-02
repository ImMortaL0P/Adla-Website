const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

let cachedDrive = null;
let cachedCredentials = null;

const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive'];

/**
 * Service-account JSON from env var, key file path, or local service-account.json.
 */
function getServiceAccountCredentials() {
  if (cachedCredentials) return cachedCredentials;

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      cachedCredentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      return cachedCredentials;
    } catch (err) {
      console.error('Invalid GOOGLE_SERVICE_ACCOUNT_JSON:', err.message);
      return null;
    }
  }

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credPath && fs.existsSync(credPath)) {
    cachedCredentials = JSON.parse(fs.readFileSync(credPath, 'utf8'));
    return cachedCredentials;
  }

  const localPath = path.join(__dirname, '..', 'service-account.json');
  if (fs.existsSync(localPath)) {
    cachedCredentials = JSON.parse(fs.readFileSync(localPath, 'utf8'));
    return cachedCredentials;
  }

  return null;
}

function usesOAuth() {
  return Boolean(
    process.env.GOOGLE_OAUTH_REFRESH_TOKEN &&
    process.env.GOOGLE_OAUTH_CLIENT_ID &&
    process.env.GOOGLE_OAUTH_CLIENT_SECRET
  );
}

function getGalleryFolderId() {
  return process.env.DRIVE_GALLERY_FOLDER_ID || process.env.DRIVE_FOLDER_ID;
}

function getDriveConfig() {
  const oauth = usesOAuth();
  const serviceAccount = getServiceAccountCredentials();
  const galleryFolderId = getGalleryFolderId();

  return {
    authMode: oauth ? 'oauth' : serviceAccount ? 'service_account' : 'none',
    credentials: oauth || Boolean(serviceAccount),
    folderId: Boolean(process.env.DRIVE_FOLDER_ID),
    galleryFolderId: Boolean(galleryFolderId),
    serviceAccountEmail: serviceAccount?.client_email || null,
    ready: Boolean(process.env.DRIVE_FOLDER_ID && (oauth || serviceAccount)),
    uploadReady: Boolean(process.env.DRIVE_FOLDER_ID && oauth),
    galleryUploadReady: Boolean(galleryFolderId && oauth),
  };
}

function isDriveConfigured() {
  return getDriveConfig().ready;
}

async function getAuthClient() {
  if (usesOAuth()) {
    const oauth2 = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost:3333/oauth2callback'
    );
    oauth2.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });
    return oauth2;
  }

  const credentials = getServiceAccountCredentials();
  if (!credentials) return null;

  return new google.auth.GoogleAuth({
    credentials,
    scopes: DRIVE_SCOPES,
  });
}

async function getDriveService() {
  if (cachedDrive) return cachedDrive;

  const auth = await getAuthClient();
  if (!auth) {
    console.warn(
      'Google Drive auth not configured. For personal Gmail folders, set OAuth env vars ' +
      '(run: node scripts/get-oauth-token.js). Service accounts only work with Shared Drives.'
    );
    return null;
  }

  cachedDrive = google.drive({ version: 'v3', auth });
  return cachedDrive;
}

function buildImageUrls(fileId) {
  return {
    image_url: `https://drive.google.com/uc?export=view&id=${fileId}`,
    thumbnail_url: `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
    attachment_url: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
    attachment_download_url: `https://drive.google.com/uc?export=download&id=${fileId}`,
  };
}

function buildAttachmentUrls(fileId) {
  return {
    attachment_url: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
    attachment_download_url: `https://drive.google.com/uc?export=download&id=${fileId}`,
  };
}

function formatDriveError(err) {
  const msg = err?.response?.data?.error?.message || err?.message || 'Upload failed';
  if (msg.includes('Service Accounts do not have storage quota')) {
    return (
      'Google Drive rejected the upload: service accounts cannot store files in a personal ' +
      'Drive folder. Run "node scripts/get-oauth-token.js" in the backend folder, add the ' +
      'refresh token to .env, and restart the server.'
    );
  }
  return msg;
}

async function uploadToDrive(localPath, originalName, mimeType, folderId = process.env.DRIVE_FOLDER_ID) {
  const drive = await getDriveService();
  if (!drive) {
    throw new Error('Google Drive is not configured on the server.');
  }

  if (!usesOAuth()) {
    throw new Error(
      'Uploads require OAuth (personal Google account). Run: node scripts/get-oauth-token.js'
    );
  }

  if (!folderId) {
    throw new Error('Drive folder ID is not set.');
  }

  try {
    const file = await drive.files.create({
      requestBody: {
        name: originalName,
        parents: [folderId],
      },
      media: {
        mimeType,
        body: fs.createReadStream(localPath),
      },
      fields: 'id',
      supportsAllDrives: true,
    });

    const fileId = file.data.id;

    await drive.permissions.create({
      fileId,
      requestBody: { role: 'reader', type: 'anyone' },
      supportsAllDrives: true,
    });

    return {
      driveFileId: fileId,
      ...buildAttachmentUrls(fileId),
    };
  } catch (err) {
    throw new Error(formatDriveError(err));
  }
}

async function deleteFromDrive(fileId) {
  const drive = await getDriveService();
  if (!drive) return;

  try {
    await drive.files.delete({ fileId, supportsAllDrives: true });
  } catch (err) {
    if (err.code !== 404) throw err;
  }
}

async function uploadImageToDrive(localPath, originalName, mimeType) {
  const folderId = getGalleryFolderId();
  const uploaded = await uploadToDrive(localPath, originalName, mimeType, folderId);
  return {
    driveFileId: uploaded.driveFileId,
    ...buildImageUrls(uploaded.driveFileId),
  };
}

async function verifyGalleryAccess() {
  const config = getDriveConfig();
  const folderId = getGalleryFolderId();

  if (!config.ready || !folderId) {
    return {
      ok: false,
      ...config,
      error: 'Missing Drive credentials or gallery folder ID',
    };
  }

  if (!usesOAuth()) {
    return {
      ok: false,
      ...config,
      error: 'Gallery uploads need OAuth. Run: node scripts/get-oauth-token.js',
    };
  }

  try {
    const drive = await getDriveService();
    const folder = await drive.files.get({
      fileId: folderId,
      fields: 'id,name,mimeType',
      supportsAllDrives: true,
    });

    return {
      ok: true,
      ...config,
      folderName: folder.data.name,
      folderId,
      usesSeparateGalleryFolder: Boolean(process.env.DRIVE_GALLERY_FOLDER_ID),
    };
  } catch (err) {
    return {
      ok: false,
      ...config,
      error: formatDriveError(err),
    };
  }
}

async function verifyDriveAccess() {
  const config = getDriveConfig();
  if (!config.ready) {
    return {
      ok: false,
      ...config,
      error: 'Missing Drive credentials or DRIVE_FOLDER_ID',
    };
  }

  try {
    const drive = await getDriveService();
    const folder = await drive.files.get({
      fileId: process.env.DRIVE_FOLDER_ID,
      fields: 'id,name,mimeType',
      supportsAllDrives: true,
    });

    if (!usesOAuth()) {
      return {
        ok: false,
        ...config,
        folderName: folder.data.name,
        error:
          'Folder is reachable but uploads need OAuth for personal Google accounts. ' +
          'Run: node scripts/get-oauth-token.js',
      };
    }

    return {
      ok: true,
      ...config,
      folderName: folder.data.name,
    };
  } catch (err) {
    return {
      ok: false,
      ...config,
      error: formatDriveError(err),
    };
  }
}

module.exports = {
  isDriveConfigured,
  getDriveConfig,
  getGalleryFolderId,
  getDriveService,
  uploadToDrive,
  uploadImageToDrive,
  deleteFromDrive,
  buildAttachmentUrls,
  buildImageUrls,
  verifyDriveAccess,
  verifyGalleryAccess,
  usesOAuth,
  formatDriveError,
};
