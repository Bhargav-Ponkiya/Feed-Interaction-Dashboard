// controllers/userController.js
const User = require("./../models/User");
const SavedPost = require("./../models/SavedPost"); // future model
const ActivityLog = require("../models/ActivityLog");

const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, BadRequestError } = require("./../errors");
const {
  createTokenUser,
  attachCookiesToResponse,
  addCredits,
} = require("./../utils");

const showCurrentUser = async (req, res) => {
  const userId = req.user.userId;

  // Fetch full user document from DB
  const user = await User.findById(userId).select(
    "name email role credits bio socialLinks"
  );

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User not found" });
  }

  const savedPosts = await SavedPost.find({ userId });
  const activityLogs = await ActivityLog.find({ userId })
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(StatusCodes.OK).json({
    user,
    savedPosts,
    recentActivity: activityLogs,
  });
};

const updateUser = async (req, res) => {
  const { name, email, bio, socialLinks } = req.body;

  if (!name || !email) {
    throw new BadRequestError("Please provide name and email");
  }

  const user = await User.findById(req.user.userId);

  const wasIncomplete =
    (!user.bio || !user.socialLinks) &&
    bio.trim() !== "" &&
    socialLinks.trim() !== "";

  user.name = name;
  user.email = email;
  user.bio = bio;
  user.socialLinks = socialLinks;

  await user.save();

  if (wasIncomplete && !user.profileCompleted) {
    await addCredits(user._id, 25);
    user.profileCompleted = true; // Flag to prevent duplicate credits
    await user.save();
  }

  const tokenUser = createTokenUser({ user });
  attachCookiesToResponse({ res, payload: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

// Update user password
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Please provide both passwords");
  }

  const user = await User.findById(req.user.userId);

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw new UnauthenticatedError("Old password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password updated" });
};

// Get user's credit info
const getUserCredits = async (req, res) => {
  const user = await User.findById(req.user.userId).select("credits");
  res.status(StatusCodes.OK).json({ credits: user.credits });
};

const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("credits");

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const savedPosts = await SavedPost.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });

    const activityLogs = await ActivityLog.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(10); // optional limit for performance

    res.status(StatusCodes.OK).json({
      credits: user.credits,
      savedPosts,
      activityLogs,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching dashboard", error: error.message });
  }
};

module.exports = {
  showCurrentUser,
  updateUser,
  updateUserPassword,
  getUserCredits,
  getUserDashboard,
};
