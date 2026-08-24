const mongoose = require('mongoose');
require('./User');

const summarySchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },

  university: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },

  subject: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },

  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },

  fileUrl: {
    type: String,
    required: true,
    trim: true
  },

  fileData: {
    type: Buffer,
    required: true
  },

  fileMimeType: {
    type: String,
    required: true,
    trim: true
  },

  fileOriginalName: {
    type: String,
    required: true,
    trim: true
  },

  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Summary', summarySchema);