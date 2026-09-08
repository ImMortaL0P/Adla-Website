require('dotenv').config();
const mongoose = require('mongoose');
const Image = require('./models/Image');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const images = await Image.find();
  console.log(images.map(i => ({ key: i.key, label: i.label })));
  process.exit();
}).catch(console.error);
