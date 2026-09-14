const mongoose = require('mongoose');
require('dotenv').config({ path: 'umv-adala/backend/.env' });
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(async () => {
    const staff = await mongoose.connection.db.collection('staff').find({}).toArray();
    console.log(JSON.stringify(staff, null, 2));
    mongoose.connection.close();
  });
