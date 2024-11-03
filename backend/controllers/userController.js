const User = require("../models/User");
const bcrypt = require("bcrypt");
const { uploadFileToFirebase } = require("../middleware/firebaseConfig"); 

const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users); 
  } catch (err) {
    res.status(500).json({ message: "Error retrieving users", error: err.message });
  }
};

const getOneUser = async (req, res) => {
  const userId = req.params.id; 
  try {
    const user = await User.findById(userId); 
    if (!user) {
      return res.status(404).json({ message: "User not found" }); 
    }
    res.status(200).json(user); 
  } catch (err) {
    res.status(500).json({ message: "Error retrieving user", error: err.message });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.params.id;
  const { newUserName, currentPassword, newPassword } = req.body;
  const newAvatar = req.file; 

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (newAvatar) {
      const avatarUrl = await uploadFileToFirebase(newAvatar);
      user.avatar = avatarUrl;
    }

    if (newUserName) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to change username" });
      }

      const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      user.userName = newUserName;
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to change password" });
      }

      const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
      stack: error.stack,
    });
  }
};

module.exports = { getAllUser, getOneUser, updateProfile };
