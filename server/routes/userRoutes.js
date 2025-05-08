const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin: Get all users
router.get("/users", protect, async (req, res) => {
  try {
    const users = await User.find({}, "_id name");
    if (!users.length) {
      return res.status(404).json({ message: "No users found." });
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users." });
  }
});

// Authenticated user: Get own profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
