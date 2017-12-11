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
		const s = await database.ref('post').limitToLast(10).once('value')
		let data = []
		s.forEach((cs) => {
			const review = {
				id: cs.key,
				book: cs.val().book,
				reviewer: cs.val().reviewer.id,
				review: cs.val().review,
				createdAt: cs.val().createdAt
			}
			data.push(review)
		})
		for(let i in data){
			const user = await getUserProfile(data[i].reviewer)
			data[i].reviewer = user
		}
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
			let reviewDetail = {
				id: review.key,
				book: review.val().book,
				reviewer: review.val().reviewer.id,				
				review: review.val().review,
				createdAt: review.val().createdAt,
				comment
			}
			const user = await getUserProfile(reviewDetail.reviewer)
			reviewDetail.reviewer = user

			return reviewDetail
		}catch(err) {
			throw err
		}
	},
	subscribe: async function(subscriber, follower) {
			try {
				await validateSubscribe(subscriber, follower)
				const result = await checkSubscribe(subscriber, follower)
				console.log(result)
				if(result) {
					database.ref('subscribe').push({ 
						subscriber, 
						follower 
					})
					return {
						code:200,
						message:"success sub"
					}
				}
				return {
					code:204,
					message:"calcel sub"
				}
			} catch(err) {
				throw err
			}
	},
	getSubscribe: async function(uId) {
		const s = await database.ref('subscribe').once('value')
		const data = []
		s.forEach((cs)=>{
			if(cs.val().follower == uId){
				data.push(cs.val().subscriber)
			}
		})
		return data
	},
	postReview: async (review) => {
		const now = new Date();
		const reviewer = await getUserProfile(review.uId)
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
			try{
				const x = await getUserProfile(uId)
				const xx = await getUserBookmark(uId)
				const xxx = await getUserPosts(uId)
				const xxxx = await getUserSubscribe(uId)
				let userProfile = {
					profile: x,
					bookmark: xx,
					posts: xxx,
					subscribe: xxxx
				}
				const date = []
				for(let i in userProfile.subscribe) {
					const user = await getUserProfile(userProfile.subscribe[i].subscriber)
					date.push(user)
				}
				userProfile.subscribe = date
				return Promise.resolve(userProfile)
			}catch(err) {
				throw err
			}
	}
}

async function getUserProfile(uId){
	return await new Promise((resolve,reject)=>{
		admin.auth().getUser(uId).then((userRecord)=>{
			profile = {
				uId: userRecord.uid,
				email: userRecord.email,
				name: userRecord.displayName || '',
				image: userRecord.photoURL || ''
			}
			resolve(profile)
		})
	})
}
async function getUserBookmark(uId){
	return await new Promise((resolve,reject)=>{
		database.ref('bookmark').orderByChild('uId').equalTo(uId).on('value', function(snapshot) {
			let bookmarks = []
			if(snapshot.exists() == false)
				resolve([])
			snapshot.forEach( data => {
				const uId = data.val().uId
				Promise.all([getUserProfile(uId),getUserPosts(uId)]).then(result => {
					let book = {
						id : data.key,
						reviewId: data.val().reviewId,
						uId : uId,
					}
					book.email = result[0].email
					book.review = []
					for(i in result[1]){
						book.review.push(result[1][i].review)
					}
					bookmarks.push(book)
					if(bookmarks.length == Object.keys(snapshot.val()).length)
						resolve(bookmarks)
				})
			})
		})
	})
}
async function getUserPosts(uId){
	return await new Promise((resolve,reject)=>{
		database.ref('post').orderByChild('reviewer/id').equalTo(uId).on('value', function(snapshot) {
			let posts = []
			snapshot.forEach( data => {
				const id = {
					id: data.key
				}
				try{
					const post = Object.assign(id, data.val());
					posts.push(post)
				}
				catch(e){}
			})
			resolve(posts)
		});
	})
}
async function getUserSubscribe(uId){
	return await new Promise((resolve,reject)=>{
		if(isBlank(uId)) reject()
		database.ref('subscribe').orderByChild('follower').equalTo(uId).on('value', function(snapshot) {
			let subscribeses = []
			snapshot.forEach( data => {
				subscribeses.push(data.val())
			})
			resolve(subscribeses)
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
				database.ref('subscribe').child(cs.key).remove()
				resolve(false)
			}
		})
		resolve(true)
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
		return getUserProfile(id).then(user => user)	
	}catch(err) {
		return Promise.reject(CustomError(400, 'uId not found'))
	}
}