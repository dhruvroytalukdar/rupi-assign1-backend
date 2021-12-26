const mongoose = require("mongoose");

module.exports = async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection to database has been made");
  } catch (err) {
    console.error(err);
    console.log("Connection to database failed");
  }
};
