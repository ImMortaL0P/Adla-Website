const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. 'admission_info'
  value_en: { type: String, required: true },
  value_hi: { type: String, required: true },
}, { timestamps: true });

contentSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Content', contentSchema);
