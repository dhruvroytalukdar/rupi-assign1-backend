const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

function initializeFirebaseApp() {
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
    appId: process.env.FIREBASE_APPID,
  };

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  console.log("Firebase app initialized");
}

module.exports = initializeFirebaseApp;
