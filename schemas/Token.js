const mongoose = require("mongoose");
const { Schema } = mongoose;

const tokenSchema = new Schema({
  token: String,
});

module.exports = mongoose.model("Token", tokenSchema);
