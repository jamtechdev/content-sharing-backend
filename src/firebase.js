const admin = require("firebase-admin");
const serviceAccount = require("./content-sharing-firebase.json"); // Replace with actual path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
