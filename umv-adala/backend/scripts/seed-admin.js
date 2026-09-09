require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const run = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('Environment variable MONGODB_URI is required.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const admins = [
      {
        username: 'admin1',
        passwordRaw: 'umvadla#admin1',
        email: 'admin1@umvadla.in',
        phone: '1234567890'
      },
      {
        username: 'admin2',
        passwordRaw: 'umvadla#admin2',
        email: 'admin2@umvadla.in',
        phone: '1234567891'
      }
    ];

    for (const adminData of admins) {
      const existing = await Admin.findOne({ username: adminData.username });
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.passwordRaw, salt);
      
      if (existing) {
        existing.password = hashedPassword;
        await existing.save();
        console.log(`Updated existing admin: ${adminData.username}`);
      } else {
        await Admin.create({
          username: adminData.username,
          password: hashedPassword,
          email: adminData.email,
          phone: adminData.phone
        });
        console.log(`Created new admin: ${adminData.username}`);
      }
    }

    console.log('Admin seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding admins:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

run();
