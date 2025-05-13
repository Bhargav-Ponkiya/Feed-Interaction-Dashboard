// models/ReportedPost.js
const mongoose = require("mongoose");

const ReportedPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postId: { type: String, required: true },
  reason: { type: String, required: true },
  source: {
    type: String,
    enum: ["twitter", "reddit", "linkedin"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

ReportedPostSchema.index({ userId: 1, postId: 1, source: 1 }, { unique: true });

module.exports = mongoose.model("ReportedPost", ReportedPostSchema);
