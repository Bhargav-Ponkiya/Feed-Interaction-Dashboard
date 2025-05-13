const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require("../middleware/authentication");
const {
  getUserAnalytics,
  getSystemAnalytics,
  adminUpdateUserCredits,
  getTimeBasedSystemAnalytics, // <-- new import
} = require("../controllers/adminController");

// Route: Time-based system analytics (last 6 weeks/months/years)
router.get(
  "/analytics/time",
  authenticateUser,
  authorizePermission("admin"),
  getTimeBasedSystemAnalytics
);

// Route: Basic system totals
router.get(
  "/analytics",
  authenticateUser,
  authorizePermission("admin"),
  getSystemAnalytics
);

// Route: All user analytics
router.get(
  "/users/analytics",
  authenticateUser,
  authorizePermission("admin"),
  getUserAnalytics
);

// Route: Update user credits
router.patch(
  "/update-credits",
  authenticateUser,
  authorizePermission("admin"),
  adminUpdateUserCredits
);

module.exports = router;
