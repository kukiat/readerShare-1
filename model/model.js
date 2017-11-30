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
	},
	postReview: async (review) => {
		return await new Promise((resolve, reject) => {
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
			database.ref('post').push(data)
			getMessage(review.uId)
				.then((message)=> {
					microgear.connect('noti')
					microgear.on('connected', () => {
						microgear.publish('/message', JSON.stringify(message))
						microgear.disconnect()
					})
					resolve('success')
				})
		})
	},
	comment: function(review) {
		database.ref('post').child(`/${review.reviewId}/comment`)
		.push({
			uId: review.uId,
			reviewContent: review.reviewContent,
			reviewId: review.reviewId
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

async function getMessage(reviewerId) {
	var allFollower = []
	const s = await database.ref('subscribe').once('value')
	s.forEach(cs => {
		if(cs.val().subscriber == reviewerId){
			allFollower.push(cs.val().follower)
		}
	})
	return allFollower
}