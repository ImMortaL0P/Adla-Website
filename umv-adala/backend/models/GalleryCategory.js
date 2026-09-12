const mongoose = require('mongoose');

const galleryCategorySchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true
  },
  label_en: {
    type: String,
    required: true
  },
  label_hi: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GalleryCategory', galleryCategorySchema);
