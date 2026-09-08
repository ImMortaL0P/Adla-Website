require('dotenv').config({ path: '.env' });
const { google } = require('googleapis');
async function test() {
  const oauth2 = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET
  );
  oauth2.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });
  const drive = google.drive({ version: 'v3', auth: oauth2 });
  const meta = await drive.files.get({ fileId: '1Ggu7-foawxFK-gycRNx-holcGSLJTnM9', fields: 'id,name,mimeType', supportsAllDrives: true });
  console.log(meta.data);
}
test();
