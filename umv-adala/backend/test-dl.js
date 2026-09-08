const axios = require('axios');
const fs = require('fs');
async function downloadFile(fileId, destPath) {
  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    validateStatus: false
  });
  console.log('Headers:', response.headers);
  const writer = fs.createWriteStream(destPath);
  response.data.pipe(writer);
}
downloadFile('1AKsw0Brrk1QjiEhM1IP1I7Zn86AcFHNv', 'test-dl.jpg');
