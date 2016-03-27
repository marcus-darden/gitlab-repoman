'use strict';

var express = require('express');
var passport = require('passport');
var models = require('../models');
var courseHelper = require('../helpers/course');
var middleware = require('../helpers/middleware');

var router = express.Router({ mergeParams: true });

var routes = {};

routes.homepage = function homepage(req, res, next) {
  // app.get('/:username', isAuthenticated, user.homepage);
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
};

routes.update = function update(req, res, next) {
  // app.post('/:username', isOwner, user.update);
  res.sendStatus(201);
};

routes.edit = function edit(req, res, next) {
  // app.get('/:username/edit', isOwner, user.edit);
  res.sendStatus(200);
};

// Protect these routes behind authentication
router.use(middleware.isAuthenticated);

// Connect the routes to handlers
router.get('/', routes.homepage);
router.post('/', middleware.isOwner, routes.update);
router.get('/edit', middleware.isOwner, routes.edit);

module.exports = {
  router: router,
  routes: routes,
};
