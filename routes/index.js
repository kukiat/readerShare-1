var express = require('express');
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var router = express.Router();
var Model = require('../model/model');


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/mock/feeds', function(req, res, next) {
  let feed = require('../utils/feed')
  res.json(feed.getFeed())
})

router.get('/mock/review/:id', function(req, res, next) {
  let getFeed = require('../utils/getFeed')
  res.json(getFeed.findFeed(req.params.id))
})

router.post('/mock/subscribe', function(req, res, next) {
  Model.notification()
  res.send('ok')
})

router.get('/feeds', function(req, res, next) {
  Model.getAllReview()
  .then((data) => res.status(200).send(data))
  .catch((err) => res.status(err.code).send(err))
})

router.get('/review/:reviewId', function(req, res, next) {
  Model.getReviewById(req.params.reviewId)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(404).send({ message: err } || 'err'))
})

router.post('/subscribe', function(req, res, next) {
  Model.subscribe(req.body.subscriber, req.body.follower)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err))
})

module.exports = router;



