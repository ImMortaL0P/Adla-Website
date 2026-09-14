const express = require('express');
const nodemailer = require('nodemailer');
const Enquiry = require('../models/Enquiry');
const router = express.Router();

// Get SMTP details from ENV, fallback to zoho defaults (likely .in or .com, user can specify SMTP_HOST in .env)
const smtpHost = process.env.SMTP_HOST || 'smtp.zoho.in';
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

let transporter = null;
if (smtpUser && smtpUser !== 'your_email@gmail.com' && smtpPass && smtpPass !== 'your_app_password') {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: 465,
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

// POST new enquiry
router.post('/', async (req, res) => {
  try {
    const { studentName, parentName, phone, email, standard, previousSchool, message } = req.body;

    // 1. Save to Database
    const newEnquiry = new Enquiry({
      studentName,
      parentName,
      phone,
      email,
      standard,
      previousSchool,
      message
    });
    await newEnquiry.save();

    // 2. Send Email if Transporter is configured
    if (transporter) {
      const mailOptions = {
        from: `"Adla School Website" <${smtpUser}>`, // Must be the zoho email address
        to: smtpUser, // Send TO themselves
        subject: `New Admission Enquiry: ${studentName}`,
        text: `You have received a new admission enquiry.

Details:
- Student Name: ${studentName}
- Parent Name: ${parentName}
- Phone Number: ${phone}
- Email: ${email || 'N/A'}
- Class/Standard: ${standard}
- Previous School: ${previousSchool || 'N/A'}

Message:
${message || 'N/A'}

Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
`,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailErr) {
        console.error('Failed to send enquiry email (enquiry saved to DB):', emailErr);
        // We don't throw, we still want to return 200 since the DB save succeeded
      }
    } else {
      console.warn('Enquiry saved but SMTP is not configured. Email not sent.');
    }

    res.status(201).json({ message: 'Enquiry submitted successfully', enquiry: newEnquiry });
  } catch (err) {
    console.error('Error submitting enquiry:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
