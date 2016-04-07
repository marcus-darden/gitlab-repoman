const express = require('express');
const passport = require('passport');
const router = express.Router();

function logAll(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
}

// TODO: Is it cool to fly with no next() here?
function login(req, res) {
  res.render('login', { user: req.user });
}

// TODO: Is it cool to fly with no next() here?
function logout(req, res) {
  req.logout();
  res.redirect('/');
}

function strategy(req, res, next) {
  passport.authenticate(req.params.strategy)(req, res, next);
}

function authSuccess(req, res, next) {
  passport.authenticate(req.params.strategy, { failureRedirect: '/' })(req, res, next);
}

// TODO: Is it cool to fly with no next() here?
function authFailure(req, res) {
  res.redirect(`/${req.user.username}`);
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
