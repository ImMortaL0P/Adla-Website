const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title_en: { type: String, required: true },
  title_hi: { type: String },
  body_en: { type: String },
  body_hi: { type: String },
  type: { type: String, enum: ['notice', 'circular', 'order', 'tender'], default: 'notice' },
  attachment_url: { type: String },
  attachment_download_url: { type: String },
  attachment_filename: { type: String },
  driveFileId: { type: String }, 
  is_published: { type: Boolean, default: true },
}, { timestamps: { createdAt: 'published_at', updatedAt: 'updated_at' } });

noticeSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.created_at = ret.published_at;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Notice', noticeSchema);
