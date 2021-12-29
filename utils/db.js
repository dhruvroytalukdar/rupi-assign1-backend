const mongoose = require("mongoose");

module.exports = async function connectToDatabase() {
  try {
    await mongoose.connect(
      "mongodb+srv://dhruvroy8:dhruv1234@test.64lcl.mongodb.net/test?retryWrites=true&w=majority",
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connection to database has been made");
  } catch (err) {
    console.error(err);
    console.log("Connection to database failed");
  }
};
