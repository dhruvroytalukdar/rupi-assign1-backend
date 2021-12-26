const express = require("express");
const upload = require("../middlewares/upload");
const router = express.Router();

router.post("/upload", upload.single("file"), (req, res) => {
  if (req.file == undefined) {
    res.statusCode = 400;
    res.send("You must select a file");
  } else {
    const imageURL = `http://localhost:3000/file/${req.file.filename}`;
    res.send(imageURL);
  }
});

module.exports = router;
