'use strict'

let express = require('express');
let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');

let apiRoutes = express.Router();

let app = express();

let config = require('./config');

// app.set('superSecret', config.secret);

let testUser = "Katie";
let testPassword = "1234";

let path = require('path');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/public/test.html'));
  res.cookie = "auth-token=kdhfsldj";
  console.log(req.cookies);
});

app.get('/hello', function(req, res){
  res.send('Hello! The API is at http://localhost:3000/api');
});

apiRoutes.post('/authenticate', function(req, res){

  // res.send(app.get('superSecret'));

  if(testUser != req.body.name){
    res.json({success: false, message: 'Authentication failed. Not right user'});
  }else{
    if(testPassword != req.body.password) {
      res.json({success: false, message: 'Authentication failed. Wrong password.'});
    } else {
      var token = jwt.sign({user:'username'}, 'secret',  {
        expiresIn: '5m'
      });

      res.json({success: true, message: 'Enjoy your token!', token: token});

      //save to cookie

    }
  }

});

apiRoutes.use(function(req, res, next){
  let token = req.body.token || req.query.token || req.headers['x-access-token'];

  if(token) {
    jwt.verify(token, 'secret', function(err, decoded) {
      if(err){
        return res.json({success: false, message: 'Failed to authenticate token.'});
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }else {
    return res.status(403).send({
      success: false,
      message: 'No token provided'
    });
  }
});


apiRoutes.get('/needstoken', function(req, res){
  res.send('Congrats you made it here because you have a token!!!!');
});

app.use('/api', apiRoutes);

app.listen(3000);
