const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    required: [true, 'Username is required'],
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [50, 'Username cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId && !this.githubId; 
    },
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  googleId: {
    type: String,
    default: null,
  },
  githubId: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
