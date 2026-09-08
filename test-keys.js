require('dotenv').config({ path: 'umv-adala/backend/.env' });
const mongoose = require('mongoose');
const Image = require('./umv-adala/backend/models/Image');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const images = await Image.find();
  console.log(images.map(i => ({ key: i.key, label: i.label, url: i.url })));
  process.exit();
}).catch(console.error);
