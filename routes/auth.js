const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../schemas/User");
const Token = require("../schemas/Token");
const { generateAccessToken } = require("../utils/token");
const router = express.Router();

router.post("/token", (req, res) => {
  const token = req.body.token;

  // check for the refresh token in the database
  if (token == null) return res.sendStatus(401);

  Token.findOne({ token: req.body.token }, (err, obj) => {
    if (err || !token) {
      res.statusCode = 403;
      res.send({ message: "Token does not exist" });
    } else {
      jwt.verify(obj.token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          console.error(err);
          return res.sendStatus(403);
        }
        const accessToken = generateAccessToken(user);
        res.statusCode = 200;
        res.json({ accessToken: accessToken });
      });
    }
  });
});

router.delete("/logout", async (req, res) => {
  if (!req.body.token || req.body.token.length <= 0)
    res.send({ message: "Please send the refresh token" });
  else {
    await Token.deleteOne({ token: req.body.token });
    res.sendStatus(204);
  }
});

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }, async (err, user) => {
    if (err || !user) {
      console.error(err, user);
      res.statusCode = 400;
      res.send({ message: "User does not exists." });
    } else if (user.password !== password) {
      console.log("Wrong password.");
      res.statusCode = 403;
      res.json({ message: "Wrong password." });
    } else {
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(
        user.toJSON(),
        process.env.REFRESH_TOKEN_SECRET
      );
      await Token.create({ token: refreshToken });
      res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: user,
      });
    }
  });
});

router.post("/me", (req, res) => {
  Token.findOne({ token: req.body.token }, (err, obj) => {
    if (err || !obj) {
      res.statusCode = 403;
      res.send({ message: "Token does not exist" });
    } else {
      jwt.verify(obj.token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          console.error(err);
          return res.sendStatus(403);
        }
        const accessToken = generateAccessToken(user);
        res.statusCode = 200;
        res.json({ accessToken: accessToken, user: user });
      });
    }
  });
});

router.post("/register", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }, async (err, user) => {
    if (err || user) {
      console.error(err, user);
      res.statusCode = 400;
      res.send({ message: "User already exists with that email" });
    } else {
      const user = await User.create({
        email: email,
        name: name,
        password: password,
      });
      user.save();
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(
        user.toJSON(),
        process.env.REFRESH_TOKEN_SECRET
      );
      await Token.create({ token: refreshToken });
      res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: user,
      });
    }
  });
});

module.exports = router;
