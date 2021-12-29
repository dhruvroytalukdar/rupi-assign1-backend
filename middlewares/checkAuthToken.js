const jwt = require("jsonwebtoken");

function checkAuthToken(req, res, next) {
  const authToken = req.headers["authorization"]?.split(" ")[1];
  if (authToken == null) return res.sendStatus(401);
  jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(405);
    req.user = user;
    next();
  });
}

module.exports = checkAuthToken;
