const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  caption_en: { type: String, required: true },
  caption_hi: { type: String },
  category: {
    type: String,
    enum: ['campus', 'classrooms', 'events', 'sports', 'annual_function', 'independence_day'],
    default: 'campus',
  },
  image_url: { type: String, required: true },
  thumbnail_url: { type: String },
  driveFileId: { type: String },
  taken_on: { type: Date },
  display_order: { type: Number, default: 0 },
  is_published: { type: Boolean, default: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

gallerySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model('GalleryImage', gallerySchema);
