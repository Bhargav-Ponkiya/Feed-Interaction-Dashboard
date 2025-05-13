// routes/feedRoutes.js

const express = require("express");
const router = express.Router();
const { authenticateUser } = require("./../middleware/authentication");

const {
  getFeed,
  savePost,
  sharePost,
  reportPost,
} = require("./../controllers/feedController");

router.get("/aggregate", authenticateUser, getFeed); // Fetch aggregated posts
router.post("/savePost", authenticateUser, savePost); // Save posts
router.post("/share", authenticateUser, sharePost);
router.post("/report", authenticateUser, reportPost);

module.exports = router;
