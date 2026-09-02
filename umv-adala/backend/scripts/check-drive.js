#!/usr/bin/env node
require('dotenv').config();
const { verifyDriveAccess, getDriveConfig } = require('../lib/drive');

async function main() {
  const config = getDriveConfig();
  const result = await verifyDriveAccess();

  console.log('Google Drive configuration check\n');
  console.log(`  Auth mode            : ${config.authMode}`);
  console.log(`  DRIVE_FOLDER_ID set  : ${config.folderId ? 'yes' : 'no'}`);
  console.log(`  OAuth refresh token  : ${process.env.GOOGLE_OAUTH_REFRESH_TOKEN ? 'yes' : 'no'}`);
  console.log(`  OAuth client ID      : ${process.env.GOOGLE_OAUTH_CLIENT_ID ? 'yes' : 'no'}`);

  if (result.folderName) {
    console.log(`  Folder name          : ${result.folderName}`);
  }

  if (result.ok) {
    console.log('\nDrive is ready for notice uploads.');
    process.exit(0);
  }

  console.log(`\nDrive is NOT ready: ${result.error}`);
  console.log('\nSetup for personal Gmail (recommended):');
  console.log('  1. Google Cloud Console → Credentials → OAuth 2.0 Client ID (Desktop app)');
  console.log('  2. Add GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET to .env');
  console.log('  3. Run: npm run get-oauth-token');
  console.log('  4. Add GOOGLE_OAUTH_REFRESH_TOKEN to .env');
  console.log('  5. Set DRIVE_FOLDER_ID to your notices folder ID');
  console.log('  6. Restart the backend');
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
