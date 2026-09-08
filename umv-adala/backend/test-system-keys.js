require('dotenv').config();
const mongoose = require('mongoose');
const Image = require('./models/Image');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const images = await Image.find({ category: 'system' }).lean();
    console.log(images);
    process.exit(0);
});
