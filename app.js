
  //Global Variables

  const express = require('express');
  const bodyParser = require('body-parser');
  const validator = require('express-validator');
  const session = require('express-session');
  const path = require('path');
  const models = require('./models');
  const app = express();

  let display = '';
  let message = '';

  //Middleware

  //Template Engine
  app.set('view engine', 'ejs');
  app.use('/public',express.static(__dirname + '/public'));

  //Body Parser
  app.use(bodyParser.urlencoded({extended: true }));
  app.use(bodyParser.json());

  //Validation
  app.use(validator());

  //Sessions
  app.use(session({secret: '888***888***', saveUninitialized: true, resave: false}));

  //Routes
  app.get('/', function(req, res) {
    res.render('index', {title: 'Gabble', pageID: 'HomePage', success: false, errors: req.session.errors});
    req.session.errors = null;
  })

  app.get('/user', function(req, res) {
    res.render('user', {title: 'Gabble', display: display, pageID: display});
  })

  app.get('/login', function(req, res) {
    res.render('login', {title: 'Gabble', pageID: 'login', success: false, errors: req.session.errors});
    req.session.errors = null;
  })

  app.get('/logout', function(req, res) {
    res.render('logout', {title: 'Gabble', pageID: 'logout'});
    req.session.destroy();
    console.log(display + ' has logged out')
  })

  app.get('/register', function(req, res) {
    res.render('register', {title: 'Gabble', pageID: 'register', success: false, errors: req.session.errors});
    req.session.errors = null;
  })

  app.get('/gab', function(req, res) {
    models.posts.findOne({where: {displayname: 'Dylan'}}).then(function(data){
    // for loop to run through all gabs
    message = data.gab;
    console.log(message);
    res.render('gab', {title: 'Gabble', pageID: 'gab', display: display, message: message, user: display});
    })
  })

  app.post('/register', function(req, res) {
    req.check('password', 'Passwords do not match').isLength({min: 6}).equals(req.body.passwordConfirm);
    let errors = req.validationErrors();
    if (errors) {
      req.session.errors = errors;
      res.redirect('/');
    } else {
    req.session.initiate = req.body.displayName + ' session activated';
    console.log(req.session.initiate);
    let user = models.users.build({
      displayname: req.body.displayName,
      username: req.body.usernameRegister,
      password: req.body.password
    })
    display = req.body.displayName;
    user.save().then(function(newUser){
    res.redirect('/user');
  })
  }
  })

  app.post('/login', function(req, res) {
    models.users.findOne({where: {username: req.body.usernameLogin, password: req.body.password}}).then(function(data){
      req.session.initiate = data.displayname + ' session activated';
      console.log(req.session.initiate);
      display = data.displayname;
      res.redirect('/user');
    })
  })

  app.post('/gab', function(req, res) {
    let post = models.posts.build({
      displayname: display,
      gab: req.body.gab
    })
    console.log(display)
    message = req.body.gab;
    post.save().then(function(newPost){
    res.redirect('/gab');
  })
  })


  //Listen
  app.listen(3003); {
    console.log('Server running on port 3003');
  }
