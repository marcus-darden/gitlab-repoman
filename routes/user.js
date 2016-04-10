'use strict';
const express = require('express');
const error = require('../helpers/error');
const middleware = require('../helpers/middleware');
const courseHelper = require('../helpers/course');

const router = express.Router({ mergeParams: true });
const routes = {};
module.exports = {
  router,
  routes,
};

routes.homepage = function homepage(req, res, next) {
  // app.get('/:username', user.homepage);
  let taken;

  courseHelper.getCoursesTaken(req.user.id).then((_taken) => {
    taken = _taken;
    return courseHelper.getCoursesTaught(req.user.id);
  }).then((_taught) => {
    res.render('user', {
      taken,
      taught: _taught,
      user: req.user,
    });
  }).catch(error.handler(next, 'Could not show user.'));
};

// Connect the routes to handlers
// Protect these routes behind authentication
// mount at /:username
router.use(middleware.isAuthenticated);
router.get('/', routes.homepage);
