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
  images: [
    {
      type: String, // URL hoặc đường dẫn tới ảnh
    },
  ],
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
