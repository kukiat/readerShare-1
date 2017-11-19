var express = require('express');
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var router = express.Router();
var Model = require('../model/model');


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/feeds', function(req, res, next) {
  let feed = require('../utils/feed')
  res.json(feed.getFeed())
})

router.get('/review/:reviewId', function(req, res, next) {
  // let getFeed = require('../utils/getFeed')
  Model.getReview(req.params.reviewId)
  .then(data => res.status(200).send(data))
  .catch(data => res.status(404).send(data))
})

router.post('/post', function(req, res, next) {
  Model.postReview({
    uId: req.body.uId, 
    bookName: req.body.bookName, 
    reviewTitle: req.body.reviewTitle, 
    reviewContent: req.body.reviewContent
  })
    .then(data => res.status(200).send(data))
    .catch(data => res.status(400).send(data))
})

router.post('/comment', function(req, res, next) {
  res.json()
})

router.post('/subscribe', function(req, res, next) {
  Model.notification()
  res.send('ok')
})

router.post('/register', function(req, res, next) {
  const name = req.body.name
  const email = req.body.email
  const password_hashed = bcrypt.hashSync(req.body.password, 10)

  Model.register(email, password_hashed).then((data)=>{
    res.status(200).send(data)
  }).catch((data)=>{
    res.status(401).send(data)
  })
})

module.exports = router;



