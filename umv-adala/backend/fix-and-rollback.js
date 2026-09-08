require('dotenv').config({ path: '.env' });
const { google } = require('googleapis');
const mongoose = require('mongoose');
const map = require('./scripts/sync-map.json');

const Notice = require('./models/Notice');
const Image = require('./models/Image');
const GalleryImage = require('./models/GalleryImage');
const Staff = require('./models/Staff');

async function run() {
  const oauth2 = new google.auth.OAuth2(process.env.GOOGLE_OAUTH_CLIENT_ID, process.env.GOOGLE_OAUTH_CLIENT_SECRET);
  oauth2.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });
  const drive = google.drive({ version: 'v3', auth: oauth2 });

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to Client DB");

  // Revert DB
  const rev = {};
  for(const [oldId, curId] of Object.entries(map)) {
    rev[curId] = oldId;
  }

  let count = 0;
  for(let M of [Notice, Image, GalleryImage, Staff]) {
    for(const doc of await M.find({})) {
      if(rev[doc.driveFileId]) { // It has the BAD id
        doc.driveFileId = rev[doc.driveFileId];
        await doc.save();
        count++;
      }
    }
  }
  console.log("Reverted", count, "docs in DB");

  // Delete bad files from new Drive
  for(const curId of Object.values(map)) {
    try {
      await drive.files.delete({ fileId: curId, supportsAllDrives: true });
      console.log("Deleted bad file", curId);
    } catch(e) {
      console.log("Could not delete", curId, e.message);
    }
  }

  console.log("Done");
  process.exit(0);
}
run();
