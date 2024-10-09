const bcrypt = require("bcrypt");
const User = require("../models/User");

const register = async (req, res) => {
  const { userName, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
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
    console.error("Registration error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
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
      console.log("Creating new user with userName:", userName); 

      const newUser = {
        userName,
        email,
        role: "user", 
      };

      if (providerId === 'google') {
        newUser.googleId = email;
      } else if (providerId === 'github') {
        newUser.githubId = email;
      }

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
      },
    });
  } catch (error) {
    console.error("Error during loginWithProvider:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

const logout = (req, res) => {
  res.clearCookie("userId");
  res.clearCookie("role");
  return res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  register,
  login,
  logout,
  loginWithProvider 
};
