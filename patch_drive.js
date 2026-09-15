const fs = require('fs');
const filepath = 'umv-adala/backend/lib/drive.js';
let content = fs.readFileSync(filepath, 'utf8');
content = content.replace(
  'async function getAuthClient() {',
  'async function getAuthClient(forceServiceAccount = false) {\n  if (forceServiceAccount) {\n    const credentials = getServiceAccountCredentials();\n    if (credentials) {\n      return new google.auth.GoogleAuth({\n        credentials,\n        scopes: DRIVE_SCOPES,\n      });\n    }\n  }'
);
content = content.replace(
  'async function getDriveService() {',
  'async function getDriveService(forceServiceAccount = false) {\n  // do not cache if forcing service account\n  if (!forceServiceAccount && cachedDrive) return cachedDrive;\n\n  const auth = await getAuthClient(forceServiceAccount);'
);
content = content.replace(
  'async function streamDriveFile(fileId, res, reqArgs = {}) {\n  const drive = await getDriveService();',
  'async function streamDriveFile(fileId, res, reqArgs = {}) {\n  const drive = await getDriveService(true); // force service account for streams'
);
fs.writeFileSync(filepath, content);
console.log('Patched');
