var express = require('express');
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/feeds', function(req, res,next) {
  res.json(res)
})

router.get('/review/:id', function(req, res,next) {
  res.json()
})

router.post('/post', function(req, res,next) {
  res.json()
})

router.post('/comment', function(req, res,next) {
  res.json()
})

router.post('/subscribe', function(req, res,next) {
  res.json()
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
// CREATE TABLE user(id SERIAL PRIMARY KEY, email VARCHAR(40) not null, password VARCHAR(100) not null ,name VARCHAR(40) not null);
router.post('/register', function(req, res, next) {
  //need to validate
  const name = req.body.name
  const email = req.body.email
  const hash_password = bcrypt.hashSync(req.body.password, 10)
  
  if(!user){
    client.query(text, values)
    .then(users => res.status(200).send('register success'))
    .catch(err => console.error(err.stack))
  }else if(user){
    res.status(422).send('already use email')
  }
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



