const { google } = require('googleapis');
const fs = require('fs');

async function test() {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'service-account.json',
    scopes: ['https://www.googleapis.com/auth/drive']
  });
  const drive = google.drive({ version: 'v3', auth });
  
  try {
    const meta = await drive.files.get({ fileId: '1lPjZqqK5jwTPkKmHKRLohUNmKihB8rW8', fields: 'id,name,mimeType', supportsAllDrives: true });
    console.log("Success reading from service account:", meta.data);
  } catch(e) {
    console.log("Failed reading from service account:", e.message);
  }
}
test();
