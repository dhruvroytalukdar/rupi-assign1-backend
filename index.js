const express = require("express");
require("dotenv").config();
const checkAuthToken = require("./middlewares/checkAuthToken");
const app = express();
const auth = require("./routes/auth");
const connectToDatabase = require("./utils/db");
connectToDatabase();
const initializeFirebaseApp = require("./utils/firebase");
initializeFirebaseApp();
const upload = require("./routes/upload");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", auth);
app.use("/file", upload);

app.get("/", checkAuthToken, (req, res) => {
  res.send("Hi");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started at port 3000");
});
