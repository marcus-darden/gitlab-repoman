'use strict';

var express = require('express');
var passport = require('passport');
var models = require('../models');
var courseHelper = require('../helpers/course');
var middleware = require('../helpers/middleware');

function homepage(req, res, next) {
  // app.get('/:username', user.homepage);
  var taught, taken;
  return courseHelper.getCoursesTaught(req.user.id).then(function(_taught) {
    taught = _taught;
    return courseHelper.getCoursesTaken(req.user.id);
  }).then(function(_taken) {
    taken = _taken;
    res.render('user', {
      user: req.user,
      taught: taught,
      taken: taken,
    });
  });
}

function update(req, res, next) {
  // app.post('/:username', isOwner, user.update);
  res.sendStatus(201);
}

function edit(req, res, next) {
  // app.get('/:username/edit', isOwner, user.edit);
  res.sendStatus(200);
}

// Connect the routes to handlers
// Protect these routes behind authentication
// mount at /:username
var router = express.Router({ mergeParams: true });
router.use(middleware.isAuthenticated);
router.get('/', homepage);
router.post('/', middleware.isOwner, update);
router.get('/edit', middleware.isOwner, edit);

module.exports = {
  router: router,
  routes: {
    edit,
    homepage,
    update,
  },
};
