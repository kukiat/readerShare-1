var firebase = require('firebase')
var MicroGear = require('microgear')

firebase.initializeApp({
	apiKey: "AIzaSyCxV1SPVPdDQg539Ir6G0Rn5Y-WgAAgzVs",
  authDomain: "reader-db.firebaseapp.com",
  databaseURL: "https://reader-db.firebaseio.com",
  storageBucket: "reader-db.appspot.com"
})

const microgear = MicroGear.create({
	key : "6xeLdlHHWBuM49O",
	secret : "tzTRtxJbuejASaIBHWD3snUa3",
	alias: 'server'
});

var database = firebase.database();

module.exports = {
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
		const s = await database.ref('post').once('value')
		return {...s.child(reviewId).val(), ...{'id': reviewId}}
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
					resolve(message)
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
				.catch((data)=>reject(data))
		})
	}
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
