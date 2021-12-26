const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const User = require("../schemas/User");

const storage = new GridFsStorage({
  url: process.env.MONGODB_URL,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];
    const file_name = `${Date.now()}-image-${file.originalname}`;

    if (match.indexOf(file.mimetype) === -1) {
      return file_name;
    }

    User.findOne({ email: req.user.email }, (err, user) => {
      if (err) console.error(err);
      else {
        user.imageURL = file_name;
        user.save();
      }
    });

    return {
      bucketName: "photos",
      filename: file_name,
    };
  },
});

module.exports = multer({ storage });
