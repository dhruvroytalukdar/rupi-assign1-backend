const express = require("express");
require("dotenv").config();
const checkAuthToken = require("./middlewares/checkAuthToken");
const app = express();
const upload = require("./routes/upload");
const auth = require("./routes/auth");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const User = require("./schemas/User");

let gfs;
app.use(express.json());
app.use("/file", checkAuthToken, upload);
app.use("/auth", auth);

const connectToDatabase = require("./utils/db");
connectToDatabase();

const conn = mongoose.connection;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("photos");
});

app.get("/file/:filename", checkAuthToken, async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    const readStream = gfs.createReadStream({ filename: file.filename });
    readStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.statusCode = 401;
    res.send("Not Found");
  }
});

app.get("/", checkAuthToken, (req, res) => {
  res.send("Hi");
});

app.delete("/file/:filename", checkAuthToken, async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (file == null) {
      res.statusCode = 400;
      return res.send({ message: "Image deletion failed" });
    } else {
      await gfs.files.deleteOne({ filename: file.filename });
      User.findOne({ email: req.user.email }, (err, user) => {
        if (err) console.error(err);
        else {
          user.imageURL = undefined;
          user.save();
          res.send("Successfully deleted " + req.params.filename);
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.statusCode = 401;
    res.send("Not Found");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started at port 3000");
});
