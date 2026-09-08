require('dotenv').config();
const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://umvadla_db_user:LMjD0ZCW16i3w7VJ@umvadla.dlngdbr.mongodb.net/?appName=UMVAdla";

async function testImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    
    // Check what collections exist
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    const countImages = await db.collection('images').countDocuments();
    const countGallery = await db.collection('galleryimages').countDocuments();
    console.log(`Counts: images=${countImages}, gallery=${countGallery}`);
    
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
testImages();
