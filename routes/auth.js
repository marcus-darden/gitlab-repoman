'use strict';

var express = require('express');
var passport = require('passport');
var router  = express.Router();

// TODO - this looks like debug, remove it later
router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

router.get('/login', function(req, res) {
  res.render('login', { user: req.user });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/gitlab', passport.authenticate('gitlab'));

router.get('/gitlab/callback',
  passport.authenticate('gitlab', { failureRedirect: '/' }),
  function(req, res, next) {
    res.redirect('/' + req.user.username);
  }
);

module.exports = router;
