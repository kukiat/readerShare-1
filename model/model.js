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
	testPush : function(object){
		db.ref("posts").child("post").set(object);
	},
	testRetrieve : function(){
		db.ref("posts").on("value", function(snapshot) {
		  console.log(snapshot.val());
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		})
	},
	register : async function(email, password_hashed){
		return await new Promise((resolve, reject)=>{
			isNotHasUser(email).then(()=>{
				admin.auth().createUser({email, password_hashed})
				.then(function(userRecord) {resolve('success')})
				.catch(function(error) {reject('failed')});
			}).catch(()=>{
				reject('This email is exist');
			})
		})
	},
	notification: function() {
		microgear.connect('noti')
		microgear.on('connected', function() {
			console.log('test')
			microgear.publish('/message','eieieeiieieie.')
			microgear.disconnect()
		})
	}
}

async function isNotHasUser(email){
	return await new Promise(function(resolve, reject){
		admin.auth().getUserByEmail(email)
		  .then(function(userRecord) {
		    reject()
		  }).catch(function(error) {
		    resolve()
		  });
	})
}

