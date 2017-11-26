var express = require('express');
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var router = express.Router();
var Model = require('../model/model');
var MicroGear = require('microgear')

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/mockFeeds', function(req, res, next) {
  var feed = require('../utils/feed')
  res.json(feed.getFeed())
})

router.get('/mockReview/:reviewId', function(req, res, next) {
  var getFeed = require('../utils/getFeed')
  res.json(getFeed.findFeed(req.params.reviewId))
})

router.get('/feeds', function(req, res, next) {
  Model.getAllReview()
  .then((data)=>res.send(data))
  .catch((err)=>res.send(err))
})

router.get('/review/:reviewId', function(req, res, next) {
  Model.getReview(req.params.reviewId)
  .then(data => res.status(200).send(data))
  .catch(data => res.send(data))
})

router.post('/post', function(req, res, next) {
  Model.postReview({
    uId: req.body.uId, 
    bookName: req.body.bookName, 
    reviewTitle: req.body.reviewTitle, 
    reviewContent: req.body.reviewContent
  })
    .then(data => {
      res.status(200).send('ok')
    })
    .catch(data => res.status(400).send(data))
})

router.post('/subscribe', function(req, res, next) {
  Model.subscribe(req.body.subscriber, req.body.follower)
    .then(data => res.status(200).send(data))
    .catch(data => res.status(400).send(data))
})
module.exports = router;



