const bcrypt = require("bcrypt");
const User = require("../models/User");
const { clearChatHistory } = require("./aiController");

const register = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      role: "user", 
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.cookie("userId", user._id, {
      httpOnly: true,
      secure: false, 
      maxAge: 1 * 60 * 60 * 1000, 
    });
    res.cookie("role", user.role, {
      httpOnly: true,
      secure: false, 
      maxAge: 1 * 60 * 60 * 1000,  
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

const loginWithProvider = async (req, res) => {
  const { email, providerId } = req.body; 
  console.log("Request data:", email, providerId);

  try {
    let user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      const userName = email.split('@')[0]; 
      const defaultPassword = await bcrypt.hash(userName, 10);
      console.log("Creating new user with userName:", userName); 

      const newUser = {
        userName,
        email,
        password: defaultPassword, 
        role: "user",
        googleId: email, 
      };

      user = new User(newUser);
      await user.save(); 
      console.log("User saved:", user);
    }

    res.cookie("userId", user._id, {
      httpOnly: true,
      secure: false, 
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("role", user.role, {
      httpOnly: true,
      secure: false, 
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log("Returning user data to client");

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Error during loginWithProvider:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

const logout = async (req, res) => {
  const userId = req.query.userId;

  try {
    if (userId) {
      await clearChatHistory(userId);
    }

    res.clearCookie("userId");
    res.clearCookie("role");

    return res.status(200).json({ message: "Logout successful and chat history cleared." });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Failed to logout and clear chat history", error: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  loginWithProvider 
};
