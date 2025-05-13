// models/SavedPost.js
const mongoose = require("mongoose");

const SavedPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
      enum: ["reddit", "twitter", "linkedin"],
    },
    content: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate saves by same user for the same post
SavedPostSchema.index({ userId: 1, postId: 1, source: 1 }, { unique: true });

module.exports = mongoose.model("SavedPost", SavedPostSchema);
