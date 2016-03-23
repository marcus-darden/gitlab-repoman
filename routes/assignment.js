'use strict';

var express = require('express');
var passport = require('passport');
var models = require('../models');
var assignmentHelper = require('../helpers/assignment');
var middleware = require('../helpers/middleware');

var router = express.Router({ mergeParams: true });
var createRouter = express.Router({ mergeParams: true });

var routes = {};

routes.create = function(req, res, next) {
  // app.post('/:username/:courseLabel/assignment', isStaff, assignment.create);
  assignmentHelper.create(req.params.courseLabel, req.body).then(function(_assignment) {
    res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel + '/' + _assignment.abbr);
  });
};

routes.delete = function(req, res, next) {
  // app.post('/:username/:courseLabel/:assignmentAbbr/delete', isStaff, assignment.delete);
  assignmentHelper.delete(req.params.courseLabel, req.params.assignmentAbbr).then(function() {
    res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel);
  });
};

routes.edit = function(req, res, next) {
  // app.get('/:username/:courseLabel/:assignmentAbbr/edit', isStaff, assignment.edit);
  assignmentHelper.get(req.params.courseLabel, req.params.assignmentAbbr).then(function(_assignment) {
    res.render('assignment_edit', {
      user: req.user,
      course_label: req.params.courseLabel,
      assignment: _assignment
    });
  });
};

routes.homepage = function(req, res, next) {
  // app.get('/:username/:courseLabel/:assignmentAbbr', isAuthenticated, assignment.homepage);
  var assignment;
  assignmentHelper.get(req.params.courseLabel, req.params.assignmentAbbr).then(function(_assignment) {
    assignment = _assignment;

    return assignment.getTeams();
  }).then(function(_teams) {
    res.render('assignment', {
      user: req.user,
      course_label: req.params.courseLabel,
      assignment: assignment,
      teams: _teams
    });
  });
};

routes.new = function(req, res, next) {
  // app.get('/:username/:courseLabel/assignment', isStaff, assignment.new);
  res.render('assignment_edit', {
    user: req.user,
    course_label: req.params.courseLabel
  });
};

routes.update = function(req, res, next) {
  // app.post('/:username/:courseLabel/:assignmentAbbr', isStaff, assignment.update);
  assignmentHelper.update(req.params.courseLabel,
                            req.params.assignmentAbbr,
                            req.body).then(function(_assignment) {
    res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel + '/' + _assignment.abbr);
  });
};

// Protect these routes behind authentication
// mount at /:username/:courseLabel/:assignmentAbbr
router.use(middleware.isAuthenticated);
// mount at /:username/:courseLabel/assignment
createRouter.use(middleware.isStaff);

// Connect the routes to handlers
createRouter.get('/', routes.new);
createRouter.post('/', routes.create);

router.get('/', routes.homepage);
router.post('/', middleware.isStaff, routes.update);
router.post('/delete', middleware.isStaff, routes.delete);
router.get('/edit', middleware.isStaff, routes.edit);

module.exports = {
  router: router,
  createRouter: createRouter,
  routes: routes
};
