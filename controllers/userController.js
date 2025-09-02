// controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import connectToDatabase from "../utils/db.js";

// -------------------- Users --------------------

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    console.log("📢 getAllUsers called");
    await connectToDatabase(process.env.MONGO_URI);

    const users = await User.find().select("-password"); // exclude password
    console.log(`✅ Found ${users.length} users`);
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ getAllUsers error:", error.message || error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Create a new user (Admin only)
export const createUser = async (req, res) => {
  try {
    console.log("📢 createUser called");
    await connectToDatabase(process.env.MONGO_URI);

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();
    console.log("✅ User created:", newUser._id);
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("❌ createUser error:", error.message || error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update user (Admin only)
export const updateUser = async (req, res) => {
  try {
    console.log(`📢 updateUser called for id: ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    console.log("✅ User updated:", user._id);
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("❌ updateUser error:", error.message || error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    console.log(`📢 deleteUser called for id: ${req.params.id}`);
    await connectToDatabase(process.env.MONGO_URI);

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("✅ User deleted:", user._id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ deleteUser error:", error.message || error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getUsersCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
