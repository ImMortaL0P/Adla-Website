const mongoose = require('mongoose');
require('dotenv').config();
const Image = require('./models/Image');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const images = await Image.find();
  for (let img of images) {
    if (img.url && img.url.includes('export=view')) {
      img.url = img.url.replace('export=view&', '');
      await img.save();
      console.log('Fixed:', img.key);
    }
  }
  console.log('Done');
  process.exit(0);
});
