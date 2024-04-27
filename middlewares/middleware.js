const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model.js");

function createToken(username, secretKey) {
  return jwt.sign({ username }, secretKey, { expiresIn: "1h" });
}

async function authenticateUser(username, password) {
  const user = await userModel.findOne({ username });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  return user;
}

module.exports = {
  createToken,
  authenticateUser,
};
