const mongoose = require('mongoose');
require('./User');

const summarySchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true
  },

  university: {
    type: String,
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  description: {
    type: String,
    maxlength: 500
  },

  fileUrl: {
    type: String,
    required: true
  },

  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Summary', summarySchema);