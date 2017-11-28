var admin = require("firebase-admin");
var MicroGear = require('microgear')
var firebase = require('firebase')

firebase.initializeApp({
  apiKey: "AIzaSyCxV1SPVPdDQg539Ir6G0Rn5Y-WgAAgzVs",
  authDomain: "reader-db.firebaseapp.com",
  databaseURL: "https://reader-db.firebaseio.com",
  storageBucket: "reader-db.appspot.com"
})

var microgear = MicroGear.create({
  key : "6xeLdlHHWBuM49O",
  secret : "tzTRtxJbuejASaIBHWD3snUa3",
  alias: 'server'
});

var database = firebase.database();

module.exports = {
  notification: function() {
  	microgear.connect('noti')
      microgear.on('connected', function() {
        console.log('test')
		  microgear.publish('/message','eieieeiieieie.')
		    microgear.disconnect()
	  })
	},
	getAllReview: async function() {
		return await new Promise((resolve, reject) => {
			database.ref('post').once('value')
			.then((s) => {
				const data = []
				s.forEach((cs) => {
					const reviewKey = cs.key
					const reviewDetail = s.child(reviewKey).val()
					const review = Object.assign(reviewDetail, { id: reviewKey })
					data.push(review)
				})
				resolve(data)
			})
			.catch((err) => reject(err))
		})
	},
	getReviewById: async function(reviewId) {
		return await new Promise((resolve, reject) => {
			database.ref('post').once('value')
				.then((review) => {
					resolve(Object.assign(review.child(reviewId).val(), { id: reviewId }))
				})
				.catch(err => {
					reject('id not found')
				})
		})
	},
	subscribe: async function(subscriber, follower) {
		return await new Promise((resolve, reject) => {
			checkSubscribe(subscriber, follower)
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
				})
				.catch((data)=> reject(data))
		})
	}
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