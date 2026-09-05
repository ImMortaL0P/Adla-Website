const mongoose = require('mongoose');
require('dotenv').config();

// Update these arrays with the MongoDB _id values from the list above
const SAKHI_SAHAYTA_DESK_IDS = [
  '6a992dc5fb35ee30027cd850', // Independence Day - ends with 1afWsoX92n6lvxXJ6rPstQdpheCs0cskB
  '6a992dc5fb35ee30027cd84c', // Classrooms - ends with 1y9Ew5bVOft3c7LlzlQ_Z2CU_OOO-YnUK
  '6a992dc5fb35ee30027cd84d', // School Event - ends with 1zyuGK-qr6zzSLuMlgkHhPs330y6cYenj
  '6a992dc5fb35ee30027cd84f', // Annual Function - ends with 17xG9228itKjgIaL_jMt0vn__7HXNv7Rz
];

const PRATIBHA_SAMMAN_SAMAROH_IDS = [
  '6a992dc5fb35ee30027cd84b', // Campus View - ends with 1lPjZqqK5jwTPkKmHKRLohUNmKihB8rW8
  '6a992dc5fb35ee30027cd84e', // Sports Day - ends with 13P_P_Ng-nggdIW1NvFXQz1ouL3rp3dJz
];

async function updateCategories() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  try {
    await mongoose.connect(uri);
    console.log('Connected to database');

    const GalleryImage = require('./models/GalleryImage');

    // Update Sakhi Sahayta Desk images
    if (SAKHI_SAHAYTA_DESK_IDS.length > 0) {
      const result1 = await GalleryImage.updateMany(
        { _id: { $in: SAKHI_SAHAYTA_DESK_IDS } },
        { $set: { category: 'sakhi_sahayta_desk' } }
      );
      console.log(`Updated ${result1.modifiedCount} images to Sakhi Sahayta Desk category`);
    }

    // Update Pratibha Samman Samaroh images
    if (PRATIBHA_SAMMAN_SAMAROH_IDS.length > 0) {
      const result2 = await GalleryImage.updateMany(
        { _id: { $in: PRATIBHA_SAMMAN_SAMAROH_IDS } },
        { $set: { category: 'pratibha_samman_samaroh' } }
      );
      console.log(`Updated ${result2.modifiedCount} images to Pratibha Samman Samaroh category`);
    }

    console.log('\nCategory update complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

updateCategories();
