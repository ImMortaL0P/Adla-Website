require('dotenv').config();
const mongoose = require('mongoose');
const Image = require('./models/Image');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const heroBg = await Image.findOne({ key: 'hero_bg' });
    if (heroBg) {
        heroBg.key = 'main bg image';
        await heroBg.save();
        console.log('Updated hero_bg to main bg image');
    }
    
    const aboutBg = await Image.findOne({ key: 'about_bg' });
    if (aboutBg) {
        aboutBg.key = 'about image';
        await aboutBg.save();
        console.log('Updated about_bg to about image');
    }
    
    const remaining = await Image.find({ category: 'system' }).lean();
    console.log('Current system keys:', remaining.map(i => i.key));
    
    process.exit(0);
});
