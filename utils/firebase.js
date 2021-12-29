const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

function initializeFirebaseApp() {
  const firebaseConfig = {
    apiKey: "AIzaSyDSAEQ6eE8BVjatytLQ_EL-9Wnr1eFmcTo",
    authDomain: "rupi-assignment1.firebaseapp.com",
    projectId: "rupi-assignment1",
    storageBucket: "rupi-assignment1.appspot.com",
    messagingSenderId: "839613906739",
    appId: "1:839613906739:web:bbf714909d5253f4700846",
  };

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  console.log("Firebase app initialized");
}

module.exports = initializeFirebaseApp;
