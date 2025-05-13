const User = require("./../models/User");
const SavedPost = require("./../models/SavedPost");
const Report = require("./../models/ReportedPost");
const ActivityLog = require("./../models/ActivityLog");
const { StatusCodes } = require("http-status-codes");
const { UnauthorizedError, NotFoundError } = require("../errors");

const getUserAnalytics = async (req, res) => {
  if (req.user.role !== "admin") throw new UnauthorizedError("Access denied");

  const users = await User.find({ role: "user" }).select("name credits");

  const enrichedUsers = await Promise.all(
    users.map(async (user) => {
      const [savedCount, reportCount, activityLogs] = await Promise.all([
        SavedPost.countDocuments({ userId: user._id }),
        Report.countDocuments({ userId: user._id }),
        ActivityLog.find({ userId: user._id }).sort({ createdAt: -1 }).limit(7), // Limit for performance
      ]);

      return {
        _id: user._id,
        name: user.name,
        credits: user.credits,
        savedCount,
        reportCount,
        activityLogs,
      };
    })
  );

  res.status(StatusCodes.OK).json({ users: enrichedUsers });
};

const getSystemAnalytics = async (req, res) => {
  if (req.user.role !== "admin") throw new UnauthorizedError("Access denied");

  const totalUsers = await User.countDocuments({ role: "user" });
  const totalSaved = await SavedPost.countDocuments();
  const totalReports = await Report.countDocuments();

  res.status(StatusCodes.OK).json({
    totalUsers,
    totalSaved,
    totalReports,
  });
};

const adminUpdateUserCredits = async (req, res) => {
  const { userId, credits } = req.body;
  if (req.user.role !== "admin")
    throw new UnauthorizedError("Only admins can update credits");

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  user.credits = credits;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Credits updated", user });
};

const getTimeBasedSystemAnalytics = async (req, res) => {
  if (req.user.role !== "admin") throw new UnauthorizedError("Access denied");

  const { range = "months" } = req.query;

  // Set group format and time range
  let groupFormat, dateFrom;
  const now = new Date();

  if (range === "weeks") {
    groupFormat = {
      year: { $year: "$createdAt" },
      week: { $isoWeek: "$createdAt" },
    };
    dateFrom = new Date();
    dateFrom.setDate(now.getDate() - 7 * 6); // last 6 weeks
  } else if (range === "months") {
    groupFormat = {
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" },
    };
    dateFrom = new Date();
    dateFrom.setMonth(now.getMonth() - 5); // last 6 months
  } else if (range === "years") {
    groupFormat = { year: { $year: "$createdAt" } };
    dateFrom = new Date();
    dateFrom.setFullYear(now.getFullYear() - 5); // last 6 years
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid range" });
  }

  // Aggregation helpers
  const aggregateCounts = async (Model) =>
    await Model.aggregate([
      { $match: { createdAt: { $gte: dateFrom } } },
      { $group: { _id: groupFormat, count: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1 } },
    ]);

  const [savedData, reportData, userData] = await Promise.all([
    aggregateCounts(SavedPost),
    aggregateCounts(Report),
    aggregateCounts(User),
  ]);

  res.status(StatusCodes.OK).json({
    range,
    savedData,
    reportData,
    userData,
  });
};

module.exports = {
  getUserAnalytics,
  getSystemAnalytics,
  adminUpdateUserCredits,
  getTimeBasedSystemAnalytics,
};
