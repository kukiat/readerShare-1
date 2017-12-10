var firebase = require('firebase')
var MicroGear = require('microgear')

module.exports = {
  firebase: firebase.initializeApp({
    apiKey: "AIzaSyDPQXK7m8AcAv6FDzcJMI4dsFzD2vhy-tc",
    authDomain: "readershare-103ec.firebaseapp.com",
    databaseURL: "https://readershare-103ec.firebaseio.com",
    storageBucket: "readershare-103ec.appspot.com"
  }).database(),
  microgear: MicroGear.create({
    key : "a4OavAaNmJ2HUUZ",
    secret : "KnE8YvodLiWpBCtMvE9fmrFaD",
    alias: 'server'
  })
}