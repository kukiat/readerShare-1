
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
	notification: () => {
		microgear.connect('noti')
		microgear.on('connected', () => {
			microgear.publish('/message', 'notification from server.')
			microgear.disconnect()
		})
	},
	getAllReview: async function() {
		return await new Promise((resolve, reject) =>{
			database.ref('post').once('value')
			.then((s)=>{
				const data = []
				s.forEach((cs)=> {
					const reviewKey = cs.key
					const reviewDetail = s.child(reviewKey).val()
					const review = {...reviewDetail, ...{'id': reviewKey} }
					data.push(review)
				})
				resolve(data)
			})
			.catch((err)=>reject(err))
		})
	},
	getReview: async function(reviewId) {
		return await new Promise((resolve,reject)=>{
			database.ref('post').once('value')
			.then((s) => {
				resolve({...s.child(reviewId).val(), ...{'id': reviewId}})
			})
			.catch(err => reject(err))
		})
	},
	postReview: async (review) => {
		return await new Promise((resolve, reject) => {
			const refPost = database.ref('post')
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
					content: review.reviewContent,
					rating: 0,
					like: 0,
				},
				comment:[]
			}
			refPost.push(data)
			resolve('post success')
		}).catch(err => reject(err))
	},
	subscribe: async function(subscriber, follower) {
		return await new Promise((resolve, reject) => {
			sameSubscribe(subscriber, follower)
				.then((data)=> {
					var regex = "^\\s+$";
					if(subscriber.match(regex) || follower.match(regex) || subscriber == '' || follower == ''){
						reject('subscriber or follower is empty')
					}
					else{
						database.ref('subscribe').push({
							'subscriber': subscriber,
							'follower': follower
						})
						resolve('success subscriber')
					}
				}).catch((err)=>reject(err))
				
			
		})
	}
}

function checkSubscribe(subscribeId) {

}

function publishToNetpie() {

}

async function checkSubscribe(subscriber, follower) {
	return await new Promise((resolve, reject) => {
		database.ref('subscribe').once('value')
		.then((s) => {
			s.forEach(cs => {
				if(cs.val().subscriber == subscriber && cs.val().follower == follower) {
					reject('cannot subscribe')
				}
			})
			resolve('can subscribe')
		})
	})
		
}
