const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  images: [
    {
      type: String, 
      required: false,
    },
  ],
  likes: {
    type: Number,
    required: false,
    default: 0,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Comment',
    },
  ],
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
