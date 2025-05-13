// models/ActivityLog.js
const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: { type: String, enum: ["save", "share", "report"], required: true },
    postId: { type: String, required: true },
    platform: {
      type: String,
      enum: ["reddit", "twitter", "linkedin"],
      required: true,
    },
    details: { type: String }, // optional message or note
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
