'use strict';

var express = require('express');
var passport = require('passport');
var router  = express.Router();

function logAll(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
}

function login(req, res, next) {
  res.render('login', { user: req.user });
}

function logout(req, res, next) {
  req.logout();
  res.redirect('/');
}

function strategy(req, res, next) {
  passport.authenticate(req.params.strategy)(req, res, next);
}

function authSuccess(req, res, next) {
  passport.authenticate(req.params.strategy, { failureRedirect: '/' })(req, res, next);
}

function authFailure(req, res, next) {
  res.redirect('/' + req.user.username);
}

// TODO - this looks like debug, remove it later
router.use(logAll);
router.get('/login', login);
router.get('/logout', logout);
router.get('/:strategy', strategy);
// FIXME: checkout these names and functionality
router.get('/:strategy/callback', authSuccess, authFailure);

module.exports = {
  router,
  routes: {
    login,
    logout,
    strategy,
    authSuccess,
    authFailure,
  },
};
