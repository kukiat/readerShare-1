var admin = require("firebase-admin");
var firebase = require('firebase')
var MicroGear = require('microgear')

var CustomError = require('../utils/error')

var microgear = MicroGear.create({
	key : "a4OavAaNmJ2HUUZ",
	secret : "KnE8YvodLiWpBCtMvE9fmrFaD",
	alias: 'server'
});

firebase.initializeApp({
  apiKey: "AIzaSyCxV1SPVPdDQg539Ir6G0Rn5Y-WgAAgzVs",
  authDomain: "reader-db.firebaseapp.com",
  databaseURL: "https://reader-db.firebaseio.com",
  storageBucket: "reader-db.appspot.com"
})

var database = firebase.database();

module.exports = {
	getAllReview: async function() {
		const s = await database.ref('post').once('value')
		const data = []
		s.forEach((cs) => {
			const reviewKey = cs.key
			const review = {
				id: reviewKey,
				book: s.child(reviewKey).val().book,
				reviewer: s.child(reviewKey).val().reviewer,
				review: s.child(reviewKey).val().review
			}
			data.push(review)
		})
		return data
	},
	getReviewById: async function(reviewId) {
		try {
			await hasReviewId(reviewId)
			const review = await database.ref('post').child(reviewId).once('value')
			const comment = []
			review.child('comment').forEach(cs=>{
				comment.push(Object.assign({}, {id: cs.key}, cs.val()))
			})
			const reviewDetail = {
				id: review.key,
				book: review.val().book,
				reviewer: review.val().reviewer,				
				review: review.val().review,
				comment
			}
			return reviewDetail
		}catch(err) {
			throw err
		}
	},
	subscribe: async function(subscriber, follower) {
			try {
				await validateSubscribe(subscriber, follower)
				await checkSubscribe(subscriber, follower)
				database.ref('subscribe').push({
					'subscriber': subscriber,
					'follower': follower
				})
			} catch(err) {
				throw err
			}
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
				.then(message => {
					microgear.connect('noti', () => {
						microgear.on('connected', () => {
							microgear.publish('/message', JSON.stringify(message))
						})
					})
					setTimeout(() => {
						microgear.disconnect()
					}, 1500);
					resolve('success')
					
				})
		})
	},
	comment: async function(review) {
		try {
			await hasReviewId(review.reviewId)
			await validateComment(review)
			database.ref('post').child(`/${review.reviewId}/comment`).push({
				uId: review.uId,
				reviewContent: review.reviewContent,
				reviewId: review.reviewId
			})
		} catch(err) {
			throw err
		}
	}
}

function isBlank(str) {
	return (!str || 0 === str.length || /^\s*$/.test(str));
}

async function hasReviewId(reviewId) {
	const s = await database.ref('post').once('value')
	return await new Promise((resolve, reject) => {
		s.forEach(cs => {
			if(cs.key == reviewId) {
				resolve()
			}
		})
		reject(CustomError(404, 'reviewId not found'))
	})
}

function validateComment(review) {
	return new Promise((resolve, reject) => {
		if(isBlank(review.uId) || isBlank(review.reviewContent) || isBlank(review.reviewId)) {
			reject(CustomError(400, 'data is empty'))
		}
		resolve()
	})
}

function validateSubscribe(subscriber, follower) {
	return new Promise((resolve, reject) => {
		if(isBlank(subscriber) || isBlank(follower)){
			reject(CustomError(400, 'subscribe or follow empty'))
		}
		resolve()
	})
}

async function checkSubscribe(subscriber, follower) {
	const s = await database.ref('subscribe').once('value')
	return await new Promise((resolve, reject) => {
		s.forEach(cs => {
			if(cs.val().subscriber == subscriber && cs.val().follower == follower) {
				reject(CustomError(400, 'already subscribe'))
			}
		})
		resolve()
	})
}

async function getMessage(reviewerId) {
	let allFollower = []
	const s = await database.ref('subscribe').once('value')
	s.forEach(cs => {
		if(cs.val().subscriber == reviewerId){
			allFollower.push(cs.val().follower)
		}
	})

	const ss = await database.ref('post').once('value')
	let lastKey
	ss.forEach(cs => {
		if(cs.val().reviewer.id == reviewerId) {
			lastKey = cs.key
		}
	})
	return {allFollower,lastKey}
}