'use strict';

var express = require('express');
var passport = require('passport');
var jade = require('jade');
//var util = require('util');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//var partials = require('express-partials');

var GitlabStrategy = require('passport-gitlab').Strategy;
var GITLAB_APP_KEY = '591ca4de44b94b972d58fc37a89141fd9c8495b4624b136573f6cf21b2bd7c9e';
var GITLAB_APP_SECRET = '14eef3ebae52699d3ecf8a36244ba67b93ecb80406f55a69da8b97481ec8d857';
 
passport.use(new GitlabStrategy({
    clientID: GITLAB_APP_KEY,
    clientSecret: GITLAB_APP_SECRET,
    gitlabURL : 'https://gitlab.eecs.umich.edu',
    callbackURL: 'http://127.0.0.1:3000/auth/gitlab/callback'
  },
  function(token, tokenSecret, profile, done) {
    console.dir(profile);
    process.nextTick(function() {
      return done(null, profile);
    });
  }
));


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });
//app.use(partials());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use('/static', express.static(__dirname + '/public'));


// Routes

app.get('/', function(req, res){
    console.log('PAGE!');
  res.render('index', { classname: 'EECS 494',
                        semester: 'Winter',
                        year: 2016,
                        user: req.user });
});

app.get('/user', ensureAuthenticated, function(req, res){
  res.render('user', { user: req.user,
                       id: 1 });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/auth/gitlab',
  passport.authenticate('gitlab'),
  function(req, res){}  // Redirected to GitLab machine, this is never called
);

app.get('/auth/gitlab/callback', 
  passport.authenticate('gitlab', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/user');
  }
);

app.listen(3000);

// Use on any resource that needs to be protected
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}
