var express = require('express');

var router = express.Router();
var Model = require('../model');
var r = require('../utils/response')

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

router.get('/feeds', async function(req, res, next) {
  try {
    const result = await Model.getAllReview()
    r.respondResult(res)(result)
  }catch(err) {
    r.respondError(res)(err)
  }
})

router.get('/review/:reviewId', async function(req, res, next) {
  try {
    const result = await Model.getReviewById(req.params.reviewId)
    r.respondResult(res)(result)
  } catch(err) {
    r.respondError(res)(err)
  }
})

router.get('/getprofile/:uid', async function(req, res, next) {
    const uId = req.params.uid
    Model.getProfile(uId).then((data)=>{
      res.status(200).json(data);
    }).catch((err)=>{res.status(400).send(err)})
});

router.post('/subscribe', async function(req, res, next) {
  try {
    await Model.subscribe(req.body.subscriber, req.body.follower)
    r.respondSuccess(res)()
  } catch(err) {
    r.respondError(res)(err)
  }
})

router.post('/post', function(req, res, next) {
  Model.postReview({
    uId: req.body.uId, 
    bookName: req.body.bookName, 
    reviewTitle: req.body.reviewTitle, 
    reviewContent: req.body.reviewContent
  })
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err))
})
 
router.post('/comment', async function(req, res, next) {
  try {
    await Model.comment({
      uId: req.body.uId,
      reviewId: req.body.reviewId,
      commentContent: req.body.commentContent
    })
    r.respondSuccess(res)()
  } catch(err) {
    r.respondError(res)(err)
  }
})

router.post('/postBookmark', async function(req, res, next) {
  try {
    await Model.postBookmark(req.body.uId, req.body.reviewId)
    r.respondSuccess(res)()
  } catch(err) {
    r.respondError(res)(err)
  }
})

router.post('/like', async function(req, res, next) {
  try {
    await Model.like(req.body.uId, req.body.reviewId)
    r.respondSuccess(res)()
  } catch(err) {
    r.respondError(res)(err)
  }
})

module.exports = router;



