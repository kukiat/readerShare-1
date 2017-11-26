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
}