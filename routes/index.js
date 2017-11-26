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


module.exports = router;



