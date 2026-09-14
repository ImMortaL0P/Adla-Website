require('dotenv').config();
const nodemailer = require('nodemailer');

async function testSMTP() {
  console.log('Testing SMTP connection for contact@umvadla.in...');

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in', // Also test smtp.zoho.com if this fails
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'contact@umvadla.in',
      pass: 'Zohomail#321', // The password provided by user
    },
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP Connection successful! The credentials work.');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: '"Adla Admin" <contact@umvadla.in>',
      to: 'contact@umvadla.in',
      subject: 'Test Email from UMV Adla',
      text: 'If you are reading this, SMTP is working perfectly.',
    });
    console.log('✅ Test email sent! ID:', info.messageId);

  } catch (error) {
    console.error('❌ SMTP Error encountered:', error.message);
    if (error.response) {
      console.error('Server response:', error.response);
    }
  }
}

testSMTP();
