'use strict';
var models = require('../models');
var courseHelper = require('./course');

var middleware = {};

middleware.isStaff = function(req, res, next) {
  console.log('****** helpers.middleware.isStaff() ******');
  if (req.isAuthenticated()) {
    courseHelper.isStaff(req.params.username, req.params.courseLabel).then(function(_isStaff) {
      if (_isStaff)
        return next();
      else
        res.redirect(303, '/' + req.params.username);
    });
  }
  else
    res.redirect(303, '/' + req.params.username);
};

middleware.isOwner = function(req, res, next) {
  console.log('****** helpers.middleware.isOwner() ******');
  if (req.isAuthenticated() && req.user && req.user.username === req.params.username)
    return next();
  res.redirect(303, req.user ? '/' + req.user.username : '/');
};

module.exports = middleware;
