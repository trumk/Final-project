const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required."],
      minlength: [3, "Project name must be at least 3 characters long."],
      maxlength: [100, "Project name cannot exceed 100 characters."],
      trim: true,
    },
    authors: [
      {
        type: String,
        required: [true, "At least one author is required."],
        minlength: [2, "Author name must be at least 2 characters long."],
        maxlength: [50, "Author name cannot exceed 50 characters."],
        trim: true,
      },
    ],
    description: {
      type: String,
      required: false,
      minlength: [50, "Description must be at least 50 characters long."],
      trim: true,
    },
    semester: {
      type: String,
      required: [true, "Semester is required."],
      enum: ["Spring", "Summer", "Fall", "Winter"],
      message: "Invalid semester value.",
    },
    department: {
      type: String,
      required: false,
      minlength: [2, "Department name must be at least 2 characters long."],
      trim: true,
    },
    images: [
      {
        type: String,
        required: false,
      },
    ],
    reports: [
      {
        type: String,
        required: false,
      },
    ],
    video: {
      type: String,
      required: false,
    },
    likes: {
      type: Number,
      required: false,
      default: 0,
      min: [0, "Likes cannot be less than 0."],
    },
    likedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Comment",
      },
    ],
    views: {
      type: Number,
      required: false,
      default: 0,
      min: [0, "Views cannot be less than 0."],
    },
    viewedByUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
