const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: false, 
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    required: false, 
  },
  type: {
    type: String,
    enum: ['like', 'comment', 'reply'],
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  message: { 
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

notificationSchema.index({ recipient: 1, isRead: 1 }); 

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;