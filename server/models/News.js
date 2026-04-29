const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  fullContent: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  image: {
    type: String,
  },
  date: {
    type: String,
  },
  author: {
    type: String,
  },
  readTime: {
    type: String,
  },
  sourceUrl: {
    type: String,
  },
  sourceName: {
    type: String,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: true });

// Optional: compound index for searching
newsSchema.index({ title: 'text', desc: 'text' });

module.exports = mongoose.model('News', newsSchema);
