require('dotenv').config();
const uri = process.env.MONGODB_URI || "";
if (uri.includes('adladata')) {
  console.log('adladata is in MONGODB_URI');
} else {
  console.log('adladata is NOT in MONGODB_URI');
}
