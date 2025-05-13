// routes/userRoutes.js
const express = require("express");
const router = express.Router();

const { authenticateUser } = require("./../middleware/authentication");
const {
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  getUserCredits,
  getSavedPosts,
  getUserDashboard,
} = require("./../controllers/userController");

// User routes
router.get("/me", authenticateUser, showCurrentUser); // Get current user profile
router.patch("/update-profile", authenticateUser, updateUser); // Update user profile
router.patch("/update-password", authenticateUser, updateUserPassword); // Update user password
router.get("/credits", authenticateUser, getUserCredits); // Get user credits
router.get("/dashboard", authenticateUser, getUserDashboard); // Get user dashboard

module.exports = router;
