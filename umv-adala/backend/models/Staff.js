const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name_en: { type: String, required: true },
  name_hi: { type: String, required: true },
  role_en: { type: String, required: true },
  role_hi: { type: String, required: true },
  qualifications_en: { type: String },
  qualifications_hi: { type: String },
  experience: { type: String },
  type: { type: String, enum: ['teaching', 'support'], required: true },
  driveFileId: { type: String }, // Optional portrait
  imageUrl: { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

staffSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    if (ret.driveFileId) {
      const { encryptId } = require('../lib/cryptoHelper');
      const hash = encryptId(ret.driveFileId);
      ret.imageUrl = `/api/media/img/${hash}`;
    }
  }
});

module.exports = mongoose.model('Staff', staffSchema);
