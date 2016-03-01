'use strict';

var express = require('express');
var passport = require('passport');
var router  = express.Router();

router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

router.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/:strategy',
  function(req, res, next) {
    passport.authenticate(req.params.strategy)(req, res, next);
  }
);

router.get('/:strategy/callback', 
  function(req, res, next) {
    passport.authenticate(req.params.strategy, { failureRedirect: '/' })(req, res, next);
  },
  function(req, res, next) {
    res.redirect('/' + req.user.username);
  }
);

module.exports = router;
