const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

async function test() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'service-account.json'),
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
  });
  
  const drive = google.drive({ version: 'v3', auth });
  
  // Try to read one of the developer's old file IDs, e.g. 1CCQkilCSRwye4nHjoU8WyFfoQDr6c8Gf
  try {
    const res = await drive.files.get({ fileId: '1CCQkilCSRwye4nHjoU8WyFfoQDr6c8Gf', fields: 'id, name, mimeType' });
    console.log("Success! File:", res.data.name, res.data.mimeType);
  } catch(e) {
    console.error("Failed:", e.message);
  }
}
test();
