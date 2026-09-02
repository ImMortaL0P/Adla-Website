const mongoose = require('mongoose');
require('dotenv').config();
const Image = require('./models/Image');
const Staff = require('./models/Staff');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const images = await Image.find();
  for (let img of images) {
    if (img.url && img.url.includes('uc?id=')) {
      img.url = img.url.replace('uc?id=', 'thumbnail?id=') + '&sz=w2000';
      await img.save();
      console.log('Fixed Image:', img.key);
    }
  }
  const staff = await Staff.find();
  for (let st of staff) {
    if (st.imageUrl && st.imageUrl.includes('uc?id=')) {
      st.imageUrl = st.imageUrl.replace('uc?id=', 'thumbnail?id=') + '&sz=w800';
      await st.save();
      console.log('Fixed Staff:', st.name_en);
    }
  }
  console.log('Done');
  process.exit(0);
});
