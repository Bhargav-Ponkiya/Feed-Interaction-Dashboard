// controllers/feedController.js

const { StatusCodes } = require("http-status-codes");
const SavedPost = require("./../models/SavedPost");
const ReportedPost = require("../models/ReportedPost");
const ActivityLog = require("../models/ActivityLog");

const {
  fetchTwitterPosts,
  fetchRedditPosts,
  fetchLinkedInPosts,
  addCredits,
} = require("./../utils");

// GET aggregated feed
const getFeed = async (req, res) => {
  try {
    const twitterPosts = await fetchTwitterPosts();
    const redditPosts = await fetchRedditPosts();
    const linkedInPosts = await fetchLinkedInPosts();

    const allPosts = [
      ...twitterPosts.map((post) => ({
        postId: post.id,
        platform: "twitter",
        content: post.text,
        url: `https://twitter.com/i/web/status/${post.id}`,
      })),
      ...redditPosts.map((post) => ({
        postId: post.id,
        platform: "reddit",
        content: post.title,
        url: post.url || "https://www.reddit.com",
      })),
      ...linkedInPosts.map((post) => ({
        postId: post.id,
        platform: "linkedin",
        content: post.commentary || "No commentary available",
        url: post.url || "#",
      })),
    ];

    res.status(StatusCodes.OK).json({ posts: allPosts });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching feed", error: error.message });
  }
};

// POST save a post to the user's saved posts
const savePost = async (req, res) => {
  try {
    const { postId, source, content, url } = req.body;

    if (!postId || !source || !content || !url) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "All fields (postId, source, content, url) are required.",
      });
    }

    const allowedSources = ["reddit", "twitter", "linkedin"];
    if (!allowedSources.includes(source.toLowerCase())) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid source. Must be reddit, twitter, or linkedin.",
      });
    }

    // Prevent duplicate saves by same user for the same post
    const alreadySaved = await SavedPost.findOne({
      userId: req.user.userId,
      postId,
      source,
    });

    if (alreadySaved) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Post already saved." });
    }

    const savedPost = new SavedPost({
      userId: req.user.userId,
      postId,
      source,
      content,
      url,
    });

    await savedPost.save();

    // Add credits for logging in
    //   await addCredits(user._id, 5); // Add 5 credits for login

    await addCredits(req.user.userId, 10); // e.g. 10 credits for save
    await ActivityLog.create({
      userId: req.user.userId,
      action: "save",
      postId,
      platform: source,
      details: "Saved a post",
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Post saved successfully", savedPost });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error saving post", error: error.message });
  }
};

const sharePost = async (req, res) => {
  const { postId, platform } = req.body;

  // This is a simulation - just log or respond with a success
  console.log(`User ${req.user.userId} shared post ${postId} on ${platform}`);

  await addCredits(req.user.userId, 5); // e.g. 5 credits for sharing
  await ActivityLog.create({
    userId: req.user.userId,
    action: "share",
    postId,
    platform,
    details: `Shared on ${platform}`,
  });

  res.status(StatusCodes.OK).json({
    msg: `Post shared on ${platform} (simulated)`,
  });
};

const reportPost = async (req, res) => {
  try {
    const { postId, reason, source } = req.body;

    if (!postId || !reason || !source) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Missing postId, reason, or source",
      });
    }

    const allowedSources = ["reddit", "twitter", "linkedin"];
    if (!allowedSources.includes(source.toLowerCase())) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid source. Must be reddit, twitter, or linkedin.",
      });
    }

    // Prevent duplicate report of the same post by the same user
    const alreadyReported = await ReportedPost.findOne({
      userId: req.user.userId,
      postId,
      source,
    });

    if (alreadyReported) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "You have already reported this post." });
    }

    const report = await ReportedPost.create({
      userId: req.user.userId,
      postId,
      reason,
      source,
    });

    await addCredits(req.user.userId, 3); // e.g. 3 credits for reporting
    await ActivityLog.create({
      userId: req.user.userId,
      action: "report",
      postId,
      platform: source,
      details: `Reported for: ${reason}`,
    });

    res.status(StatusCodes.CREATED).json({ msg: "Post reported", report });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error reporting post",
      error: error.message,
    });
  }
};

module.exports = { getFeed, savePost, sharePost, reportPost };
