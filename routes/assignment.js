'use strict';

var express = require('express');
var passport = require('passport');
var models = require('../models');
var assignmentHelper = require('../helpers/assignment');
var middleware = require('../helpers/middleware');

var routes = {};

function create(req, res, next) {
  // app.post('/:username/:courseLabel/assignment', isStaff, assignment.create);
  assignmentHelper.create(req.params.courseLabel, req.body).then(function(_assignment) {
    res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel + '/' + _assignment.abbr);
  });
};

function deleteAssignment(req, res, next) {
  // app.post('/:username/:courseLabel/:assignmentAbbr/delete', isStaff, assignment.deleteAssignment);
  assignmentHelper.deleteAssignment(req.params.courseLabel, req.params.assignmentAbbr).then(function() {
    res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel);
  });
};

function edit(req, res, next) {
  // app.get('/:username/:courseLabel/:assignmentAbbr/edit', isStaff, assignment.edit);
  assignmentHelper.get(req.params.courseLabel, req.params.assignmentAbbr).then(function(_assignment) {
    res.render('assignment_edit', {
      user: req.user,
      course_label: req.params.courseLabel,
      assignment: _assignment,
    });
  });
};

function homepage(req, res, next) {
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
      teams: _teams,
    });
  });
};

function newAssignment(req, res, next) {
  // app.get('/:username/:courseLabel/assignment', isStaff, assignment.newAssignment);
  res.render('assignment_edit', {
    user: req.user,
    course_label: req.params.courseLabel,
  });
};

function update(req, res, next) {
  // app.post('/:username/:courseLabel/:assignmentAbbr', isStaff, assignment.update);
  assignmentHelper.update(req.params.courseLabel,
                            req.params.assignmentAbbr,
                            req.body).then(function(_assignment) {
    res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel + '/' + _assignment.abbr);
  });
};

// Connect the routes to handlers
// Protect these routes behind staff membership
// mount at /:username/:courseLabel/assignment
var createRouter = express.Router({ mergeParams: true });
createRouter.use(middleware.isStaff);
createRouter.get('/', newAssignment);
createRouter.post('/', create);

// Connect the routes to handlers
// Protect these routes behind authentication
// mount at /:username/:courseLabel/:assignmentAbbr
var router = express.Router({ mergeParams: true });
router.use(middleware.isAuthenticated);
router.get('/', homepage);
router.post('/', middleware.isStaff, update);
router.post('/delete', middleware.isStaff, deleteAssignment);
router.get('/edit', middleware.isStaff, edit);

module.exports = {
  createRouter,
  router,
  routes: {
    create,
    deleteAssignment,
    edit,
    homepage,
    newAssignment,
    update,
  },
};
