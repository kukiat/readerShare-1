var admin = require("firebase-admin");
var serviceAccount = require("../utils/readershare-1-firebase-adminsdk-vjyk4-83d561f008.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://readershare-1.firebaseio.com"
});