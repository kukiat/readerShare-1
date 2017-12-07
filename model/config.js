var firebase = require('firebase')
var MicroGear = require('microgear')

module.exports = {
  firebase: firebase.initializeApp({
    apiKey: "AIzaSyCxV1SPVPdDQg539Ir6G0Rn5Y-WgAAgzVs",
    authDomain: "reader-db.firebaseapp.com",
    databaseURL: "https://reader-db.firebaseio.com",
    storageBucket: "reader-db.appspot.com"
  }).database(),
  microgear: MicroGear.create({
    key : "a4OavAaNmJ2HUUZ",
    secret : "KnE8YvodLiWpBCtMvE9fmrFaD",
    alias: 'server'
  })
}