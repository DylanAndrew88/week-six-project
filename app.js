
  //Global Variables

  const express = require('express');
  const bodyParser = require('body-parser');
  const path = require('path');
  const models = require('./models');
  const app = express();

  var display = '';


  //Middleware

  //Template Engine
  app.set('view engine', 'ejs');
  app.use('/public',express.static(__dirname + '/public'));

  //Body Parser
  app.use(bodyParser.urlencoded({extended: true }));
  app.use(bodyParser.json());


  //Routes
  app.get('/', function(req, res) {
    res.render('index', {title: 'Gabble', pageID: 'HomePage'});
  })

  app.get('/user', function(req, res) {
    res.render('user', {title: 'Gabble', pageID: 'user', display: display});
  })

  app.get('/login', function(req, res) {
    res.render('login', {title: 'Gabble', pageID: 'login'});
  })

  app.get('/register', function(req, res) {
    res.render('register', {title: 'Gabble', pageID: 'register'});
  })

  app.post('/register', function(req, res) {
    let user = models.users.build({
      displayname: req.body.displayName,
      username: req.body.username,
      password: req.body.password
    })
    display = req.body.displayName;
    user.save().then(function(newUser){
    res.redirect('/user');
  })
  })

  //Listen
  app.listen(3003); {
    console.log('Server running on port 3003');
  }
