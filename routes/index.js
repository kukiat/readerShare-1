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

router.post('/feeds', function(req, response,next) {
  client.connect()
  const text = 'INSERT INTO test(text, complete) VALUES($1, $2) RETURNING *'
  const values = ['brianc', true]
  console.log(req.body.xxx)
  client.query(text, values)
    .then(res => {
      response.status(200).send({
        message: 'create success',
      })
    })
    .catch(err => console.error(err.stack))
})

router.get('/todo/:id', function(req, response,next) {
  client.connect()
  client.query(`
    SELECT * FROM test WHERE id=${req.params.id}
  `)
    .then(res => response.json(res.rows))
    .catch(err => console.error(err.stack))
})

router.get('/todo', function(req, response,next) {
  client.connect()
  const text = 'SELECT * FROM test'

  client.query(text)
    .then(res => response.json(res.rows))
    .catch(err => console.error(err.stack))
})

router.post('/login', function(req, response, next) {
  //authen 
  const email = req.body.email
  const password = req.body.password
  client.connect()
  const text = 'SELECT * FROM users WHERE email=$1'
  const values = [email]
  client.query(text, values)
    .then(res => {
      const user = res.rows[0]
      if(!user){
        response.status(401).end('wrong email')
      }else if(user) {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if(err)
            response.json(err)
          else if(!isMatch) {
            response.status(401).send('worng password')
          }else {
            console.log(user.email)
            console.log(user.name)
            const token = jwt.sign({
              email: user.email, 
              name: user.name
            }, 'jwtforadv',{ expiresIn: 1 * 30 })
            response.status(200).send(token)
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
router.post('/register', function(req, response, next) {
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
    .then(res => {
      const user = res.rows[0]
      if(!user){
        client.query(text, values)
        .then(res => response.status(200).send('register success'))
        .catch(err => console.error(err.stack))
      }else if(user){
        response.status(422).send('already use email')

      }
    })
})

router.get('/users', function(req, response, next) {
  client.connect()
  const text = 'SELECT * FROM users'

  client.query(text)
    .then(res => response.json(res.rows))
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



