const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  parentName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  standard: { type: String, required: true },
  previousSchool: { type: String },
  message: { type: String },
  status: { type: String, enum: ['new', 'contacted', 'resolved'], default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
