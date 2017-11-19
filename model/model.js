var admin = require("firebase-admin");
var firebase = require('firebase')
var serviceAccount = require("../utils/readershare-1-firebase-adminsdk-vjyk4-83d561f008.json");
var MicroGear = require('microgear')

firebase.initializeApp({
	apiKey: "AIzaSyCxV1SPVPdDQg539Ir6G0Rn5Y-WgAAgzVs",
  authDomain: "reader-db.firebaseapp.com",
  databaseURL: "https://reader-db.firebaseio.com",
  storageBucket: "reader-db.appspot.com"
})

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://readershare-1.firebaseio.com"
});
var db = admin.database();
var database = firebase.database();
var microgear = MicroGear.create({
  key : "6xeLdlHHWBuM49O",
  secret : "tzTRtxJbuejASaIBHWD3snUa3",
  alias: 'server'
});

module.exports = {
	register : async function(email, password_hashed){
		return await new Promise((resolve, reject)=>{
			isNotHasUser(email).then(()=>{
				admin.auth().createUser({email, password_hashed})
				.then(function(userRecord) {
					console.log(userRecord)
					resolve('success')
				})
				.catch(function(error) {reject('failed')});
			}).catch(()=>{
				reject('This email is exist');
			})
		})
	},
	notification: () => {
		microgear.connect('noti')
		microgear.on('connected', () => {
			microgear.publish('/message', 'notification from server.')
			microgear.disconnect()
		})
	},
	getReview: async function(reviewId) {
		console.log(reviewId)
		return await new Promise((resolve,reject)=>{
			database.ref('/posts').on('value')
			.then((s) => {
				console.log(s.val())
				resolve(s.val())
			})
			.catch(err => reject(err))
		})
	},
	postReview: async (review) => {
		return await new Promise((resolve, reject) => {
			const refPost = database.ref('post')
			// const _book = refPost.push({
			// 	name: review.bookName,
			// 	image: "url"
			// })
			const data = {
				reviewer: {
					id: review.uId
				},
				book: {
					name: review.bookName,
					image: "url"
				},
				review:	{
					title: review.reviewTitle,
					rating: 0,
					like: 0,
					content: review.reviewContent
				},
				comment:[]
			}
			refPost.push(data)
			resolve('post success')
		}).catch(err => reject(err))
	}
}
async function isNotHasUser(email) {
	return await new Promise(function(resolve, reject){
		admin.auth().getUserByEmail(email)
		  .then(function(userRecord) {
		    reject()
		  }).catch(function(error) {
		    resolve()
		  });
	})
}

