const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

module.exports = {
  generateAccessToken,
};
