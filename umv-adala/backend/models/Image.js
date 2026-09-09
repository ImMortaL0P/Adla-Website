const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g., 'hero_bg', 'about_school', 'gallery_1'
  label: { type: String, required: true }, // Human readable label
  driveFileId: { type: String, required: true },
  url: { type: String, required: true },
  category: { type: String, enum: ['system', 'gallery'], default: 'gallery' } // system=landing/about, gallery=general gallery
}, { timestamps: true });

imageSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    if (ret.driveFileId) {
      const { encryptId } = require('../lib/cryptoHelper');
      const hash = encryptId(ret.driveFileId);
      ret.url = `/api/media/img/${hash}`;
    }
  }
});

module.exports = mongoose.model('Image', imageSchema);
