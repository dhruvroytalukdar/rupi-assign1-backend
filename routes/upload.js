const express = require("express");
const User = require("../schemas/User");
const {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getStorage,
} = require("firebase/storage");
const multer = require("multer");
const checkAuthToken = require("../middlewares/checkAuthToken");
const router = express.Router();
const storage = getStorage();
const multerObj = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

router.post(
  "/upload",
  [checkAuthToken, multerObj.single("file")],
  async (req, res) => {
    const matchList = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/jpeg/png",
    ];
    if (!matchList.includes(req.file.mimetype)) {
      res.statusCode = 403;
      res.send({ message: "File type not allowed" });
    } else {
      try {
        const imagesRef = ref(storage, `images/${req.user.email}`);
        const imageBuffer = new Uint8Array(req.file.buffer);
        await uploadBytes(imagesRef, imageBuffer, {
          contentType: "image/jpeg",
        });
        var url = await getDownloadURL(imagesRef);
        User.findOne({ email: req.user.email }, (err, user) => {
          if (err) console.log("Error ", err);
          else {
            user.imageURL = url;
            user.save();
          }
        });
        res.statusCode = 200;
        res.send({ imageURL: url });
      } catch (err) {
        console.log(err);
        res.statusCode = 404;
        res.send({ message: "File upload failed" });
      }
    }
  }
);

router.delete("/", checkAuthToken, async (req, res) => {
  try {
    const imageRef = ref(storage, `images/${req.user.email}`);
    await deleteObject(imageRef);
    User.findOne({ email: req.user.email }, (err, user) => {
      if (err) console.error(err);
      else {
        user.imageURL = undefined;
        user.save();
        res.send("Successfully deleted image of user " + req.user.email);
      }
    });
  } catch (err) {
    console.log(err);
    res.statusCode = 401;
    res.send("Something went wrong");
  }
});

module.exports = router;
