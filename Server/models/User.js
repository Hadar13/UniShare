const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },

  profileImage: {
    type: String,
    default: ''
  },

  profileImageData: {
    type: Buffer
  },

  profileImageMimeType: {
    type: String
  },

  university: {
    type: String,
    required: true
  },

  major: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

userSchema.virtual('summaries', {
  ref: 'Summary',
  localField: '_id',
  foreignField: 'uploader'
});
module.exports = mongoose.model('User', userSchema);