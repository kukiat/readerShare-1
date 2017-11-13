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

router.get('/review/:id', function(req, res, next) {
  let getFeed = require('../utils/getFeed')
  res.json(getFeed.findFeed(req.params.id))
})

router.post('/post', function(req, res, next) {
  res.json()
})

router.post('/comment', function(req, res, next) {
  res.json()
})

router.post('/subscribe', function(req, res, next) {
  res.json()
})

router.post('/testpush',function(req, res, next){
  Model.testPush(req.body);
  res.send('testPush')
})
router.get('/testretrieve',function(req, res, next){
  Model.testRetrieve();
  res.send('testRetrieve')
})

router.post('/login', function(req, res, next) {
  //authen 
  const email = req.body.email
  const password = req.body.password

  if(!user){
    res.status(401).end('wrong email')
  }else if(user) {
    bcrypt.compare(password, user.password, (err, isMatch) => {
    if(err)
      res.json(err)
    else if(!isMatch) {
      res.status(401).send('worng password')
    }else {
      const token = jwt.sign({
        email: user.email, 
        name: user.name
      }, 'jwtforadv',{ expiresIn: 60 * 1 })
        res.status(200).send(token)
      }
    })
  }
})
router.post('/register', function(req, res, next) {
  const name = req.body.name
  const email = req.body.email
  const password_hashed = bcrypt.hashSync(req.body.password, 10)

  Model.register(email, password_hashed).then((data)=>{
    res.send(data)
  }).catch((data)=>{
    res.send(data)
  })
})

router.post('/whoami', function(req, res, next) {
  const token = req.body.token
  var decoded = jwt.verify(token, 'jwtforadv', (err, decoded) => {
    if(err)
      res.json(err)
    else
      res.json(decoded)
  })
  
})

module.exports = router;



