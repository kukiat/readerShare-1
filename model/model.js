var admin = require("firebase-admin");
var serviceAccount = require("../utils/readershare-1-firebase-adminsdk-vjyk4-83d561f008.json");
var MicroGear = require('microgear')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://readershare-1.firebaseio.com"
});
var db = admin.database();

var microgear = MicroGear.create({
  key : "6xeLdlHHWBuM49O",
  secret : "tzTRtxJbuejASaIBHWD3snUa3",
  alias: 'server'
});

module.exports = {
	notification: function() {
		microgear.connect('noti')
		microgear.on('connected', function() {
			console.log('test')
			microgear.publish('/message','eieieeiieieie.')
			microgear.disconnect()
		})
	}
}
