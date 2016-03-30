'use strict';
var models = require('../models');
var courseHelper = require('./course');
var connectEnsureLogin = require('connect-ensure-login');

function isStaff(req, res, next) {
  if (req.isAuthenticated()) {
    courseHelper.isStaff(req.user.username, req.params.courseLabel).then(function(_isStaff) {
      if (_isStaff)
        return next();
      else
        res.redirect(303, '/' + req.params.username);
    });
  }
  else
    res.redirect(303, '/' + req.params.username);
}

function isOwner(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.username === req.params.username)
    return next();
  res.redirect(303, req.user ? '/' + req.user.username : '/');
}

module.exports = {
  isStaff,
  isOwner,
  isAuthenticated: connectEnsureLogin.ensureAuthenticated('/'),
};
