const { createJWT, isTokenValid, attachCookiesToResponse } = require("./jwt");
const createTokenUser = require("./createTokenUser");
const checkPermissions = require("./checkPermissions");
const addCredits = require("./creditHelper");
const {
  fetchTwitterPosts,
  fetchRedditPosts,
  fetchLinkedInPosts,
} = require("./fetchExternalFeed");

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
  addCredits,
  fetchTwitterPosts,
  fetchRedditPosts,
  fetchLinkedInPosts,
};
