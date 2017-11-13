var express = require('express');
var jwt = require('jsonwebtoken')
var pg = require('pg');
var bcrypt = require('bcrypt')

var router = express.Router();
var config = process.env.DATABASE_URL || 'postgres://localhost:5432/readershare'
var client = new pg.Client(config)

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
  client.connect()
  const text = 'SELECT * FROM users WHERE email=$1'
  const values = [email]
  client.query(text, values)
    .then(users => {
      const user = users.rows[0]
      if(!user){
        res.status(401).end('wrong email')
      }else if(user) {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if(err)
            res.json(err)
          else if(!isMatch) {
            res.status(401).send('worng password')
          }else {
            console.log(user.email)
            console.log(user.name)
            const token = jwt.sign({
              email: user.email, 
              name: user.name
            }, 'jwtforadv',{ expiresIn: 60 * 1 })
            res.status(200).send(token)
          }
        })
          
        // user.comparePassword(password, function(err, isMatch) {
        //   if(!isMatch){
        //     response.status(401).send('worng password')
        //   }else{
        //     var token = jwt.sign({
        //       email: user.email, 
        //       name: user.name
        //     })
        //     response.status(200).json(token)
        //   }
        // })
          
      }
    })
    .catch(err => console.error(err.stack))
})
// CREATE TABLE user(id SERIAL PRIMARY KEY, email VARCHAR(40) not null, password VARCHAR(100) not null ,name VARCHAR(40) not null);
router.post('/register', function(req, res, next) {
  //need to validate
  const name = req.body.name
  const email = req.body.email
  const hash_password = bcrypt.hashSync(req.body.password, 10)
  client.connect()
  const text = 'INSERT INTO users(email, password, name) VALUES($1, $2, $3)'
  const values = [email, hash_password, name]
  const text1 = 'SELECT * FROM users WHERE email=$1'
  const values1 = [email]
  
  client.query(text1, values1)
    .then(users => {
      const user = users.rows[0]
      if(!user){
        client.query(text, values)
        .then(users => res.status(200).send('register success'))
        .catch(err => console.error(err.stack))
      }else if(user){
        res.status(422).send('already use email')

      }
    })
})

router.get('/users', function(req, res, next) {
  client.connect()
  const text = 'SELECT * FROM users'

  client.query(text)
    .then(res => res.json(res.rows))
    .catch(err => console.error(err.stack))
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



