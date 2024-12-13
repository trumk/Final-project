const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is required"],
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [50, "Username cannot exceed 50 characters"],
      match: [
        /^[a-zA-Z0-9]+$/,
        "Username can only contain letters and numbers (no special characters or spaces)",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId && !this.githubId;
      },
      minlength: [6, "Password must be at least 6 characters long"],
    },
    googleId: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    avatar: {
      type: String,
      default:
        "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
