const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Admin = require('../models/Admin');
const nodemailer = require('nodemailer');

const router = express.Router();

// Helper to send email
const sendEmailOTP = async (email, otp) => {
  if (!process.env.SMTP_USER) {
    console.log(`[DEV MODE] OTP for ${email} is ${otp}`);
    return;
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or configured SMTP
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Password Reset OTP - UMV Adla',
    text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`
  });
};

const sendSmsOTP = async (phone, otp) => {
  // Placeholder for Twilio or other SMS gateway
  if (!process.env.TWILIO_SID) {
    console.log(`[DEV MODE] SMS OTP for ${phone} is ${otp}`);
    return;
  }
  const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  await twilio.messages.create({
    body: `Your UMV Adla Admin password reset OTP is: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });
};

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { admin: { id: admin.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    res.json({ token, admin: { username: admin.username, email: admin.email } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Forgot Password - Request OTP
router.post('/forgot-password', async (req, res) => {
  const { username } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    
    admin.resetOtp = hashedOtp;
    admin.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
    await admin.save();

    // Send OTP via Email and SMS
    await sendEmailOTP(admin.email, otp).catch(e => console.error("Email error:", e));
    await sendSmsOTP(admin.phone, otp).catch(e => console.error("SMS error:", e));

    res.json({ message: `OTP sent to registered email (${admin.email.replace(/(.{2})(.*)(?=@)/, "$1***")}) and phone (${admin.phone.slice(-4).padStart(admin.phone.length, '*')})` });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Reset Password - Verify OTP and update
router.post('/reset-password', async (req, res) => {
  const { username, otp, newPassword } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Invalid request' });

    if (!admin.resetOtp || admin.resetOtpExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    const isMatch = await bcrypt.compare(otp, admin.resetOtp);
    if (!isMatch) return res.status(400).json({ message: 'Invalid OTP' });

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetOtp = undefined;
    admin.resetOtpExpiry = undefined;
    await admin.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Utility to create first admin (only works if no admins exist)
router.post('/setup', async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) return res.status(400).json({ message: 'Admin already exists' });

    const { username, password, email, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = new Admin({ username, password: hashedPassword, email, phone });
    await admin.save();
    
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
