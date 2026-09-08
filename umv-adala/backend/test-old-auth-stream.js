const { google } = require('googleapis');
const fs = require('fs');

async function test() {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'service-account.json',
    scopes: ['https://www.googleapis.com/auth/drive']
  });
  const drive = google.drive({ version: 'v3', auth });
  
  try {
    const res = await drive.files.get({ fileId: '1lPjZqqK5jwTPkKmHKRLohUNmKihB8rW8', alt: 'media', supportsAllDrives: true }, { responseType: 'stream' });
    const writer = fs.createWriteStream('test-dl.jpg');
    res.data.pipe(writer);
    writer.on('finish', () => console.log('Successfully wrote using SA!'));
  } catch(e) {
    console.log("Failed reading from SA:", e.message);
  }
}
test();
