require('dotenv').config();
const mongoose = require('mongoose');

async function cleanOldLogos() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Use raw collection in case the model is moved
  const db = mongoose.connection.db;
  const result = await db.collection('images').deleteMany({ key: { $in: ['logo_main', 'logo_footer'] } });

  console.log(`Deleted ${result.deletedCount} dynamic logo overrides from database.`);
  process.exit(0);
}
cleanOldLogos().catch(console.error);
