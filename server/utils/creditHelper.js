const User = require("./../models/User");

const addCredits = async (userId, creditsToAdd) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.credits += creditsToAdd;
  await user.save();
};

module.exports = addCredits;
