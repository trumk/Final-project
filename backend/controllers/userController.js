const User = require("../models/User"); 

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

module.exports = { getAllUser, getOneUser };
