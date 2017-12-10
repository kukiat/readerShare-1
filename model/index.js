var CustomError = require('../utils/error')
var config = require('./config')
var database = config.firebase
var microgear = config.microgear

var serviceAccount = require("../utils/key.json");
var admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://readershare-103ec.firebaseio.com"
});

module.exports = {
	getAllReview: async function() {
		const s = await database.ref('post').limitToFirst(5).once('value')
		const data = []
		s.forEach((cs) => {
			const review = {
				id: cs.key,
				book: cs.val().book,
				reviewer: cs.val().reviewer,
				review: cs.val().review,
				createdAt: cs.val().createdAt
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
				createdAt: review.val().createdAt,
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
					subscriber, 
					follower 
				})
			} catch(err) {
				throw err
			}
	},
	postReview: async (review) => {
		const now = new Date();
		const reviewer = await getUserById(review.uId)
		const data = {
			reviewer,
			book: {
				name: review.bookName,
				image: "url"
			},
			review:	{
				title: review.reviewTitle,
				content: review.reviewContent,
				rating: 10,
				like: 0,
			},
			createdAt: Date.parse(now),			
			comment: []
		}
		await database.ref('post').push(data)
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
				return "ok"
			})
	},
	comment: async function(review) {
		try {
			await hasReviewId(review.reviewId)
			await validateComment(review)
			const commenter = await getUserById(review.uId)
			database.ref('post').child(`/${review.reviewId}/comment`).push({
				commenter,
				commentContent: review.commentContent,
				reviewId: review.reviewId
			})
		} catch(err) {
			throw err
		}
	},
	like: async function(uId, reviewId) {
		try {
			const like = await database.ref('post').child(reviewId).once('value')
			const updated = like.val().review.like + 1
			await database.ref('post').child(`/${reviewId}/review`).update({like: updated})
			return Promise.resolve()
		}catch(err) {
			throw err
		}
	},
	postBookmark: async function(uId, reviewId) {
		try {
			await checkBookmark(uId, reviewId)
			database.ref('bookmark').push({ uId, reviewId })
			return Promise.resolve()
		}catch(err) {
			throw err
		}
	},
	getProfile: async function(uId){
		return await new Promise((resolve,reject)=>{
			Promise.all([getUserProfile(uId),getUserBookmark(uId),getUserPosts(uId),getUserSubscribe(uId),getUserFollower(uId)])
			.then((data)=>{
				const userProfile = {
					profile: data[0],
					bookmark: data[1],
					posts: data[2],
					subscribe: data[3],
					follower: data[4]
				}
				resolve(userProfile)
			})
		})
	}
}

async function getUserProfile(uId){
	return await new Promise((resolve,reject)=>{
		admin.auth().getUser(uId).then((userRecord)=>{
			resolve(userRecord)
		})
	})
}
async function getUserBookmark(uId){
	return await new Promise((resolve,reject)=>{
		database.ref('bookmark').orderByChild('uId').equalTo(uId).on('value', function(snapshot) {
			resolve(snapshot)
		});
	})
}
async function getUserPosts(uId){
	return await new Promise((resolve,reject)=>{
		database.ref('post').orderByChild('reviewer/id').equalTo(uId).on('value', function(snapshot) {
			resolve(snapshot)
		});
	})
}
async function getUserSubscribe(uId){
	return await new Promise((resolve,reject)=>{
		database.ref('subscribe').orderByChild('subscriber').equalTo(uId).on('value', function(snapshot) {
			resolve(snapshot)
		});
	})
}
async function getUserFollower(uId){
	return await new Promise((resolve,reject)=>{
		database.ref('subscribe').orderByChild('follower').equalTo(uId).on('value', function(snapshot) {
			resolve(snapshot)
		});
	})
}

async function checkBookmark(uId, reviewId) {
	const bookmark = await database.ref('bookmark').once('value')
	return new Promise((resolve, reject)=>{
		bookmark.forEach(s => {	
			if(s.val().uId == uId && s.val().reviewId == reviewId) {
				reject(CustomError(400, 'already bookmark'))
			}
			if(isBlank(uId) || isBlank(reviewId)) {
				reject(CustomError(400, 'reviewId or uId empty'))
			}			
		})
		resolve()		
	})
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
		if(isBlank(review.uId) || isBlank(review.commentContent) || isBlank(review.reviewId)) {
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
	return { 
		allFollower,
		lastKey 
	}
}

async function getUserById(id) {
	try {
		const user = await admin.auth().getUser(id)
		return {
			id: user.uid,
			email: user.email
		}
	}catch(err) {
		return Promise.reject(CustomError(400, 'uId not found'))
	}
}