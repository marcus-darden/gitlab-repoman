'use strict';

var express = require('express');
var passport = require('passport');
var models = require('../models');
var assignmentHelper = require('../helpers/assignment');
var middleware = require('../helpers/middleware');

var router = express.Router();


var routes = {
  create: function(req, res, next) {
    // app.post('/:username/:courseLabel/assignment', isStaff, assignment.create);
    assignmentHelper.create(req.params.courseLabel, req.body).then(function(_assignment) {
      res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel + '/' + _assignment.abbr);
    });
  },

  delete: function(req, res, next) {
    // app.post('/:username/:courseLabel/:assignmentAbbr/delete', isStaff, assignment.delete);
    assignmentHelper.delete(req.params.courseLabel, req.params.assignmentAbbr).then(function() {
      res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel);
    });
  },

  edit: function(req, res, next) {
    // app.get('/:username/:courseLabel/:assignmentAbbr/edit', isStaff, assignment.edit);
    assignmentHelper.get(req.params.courseLabel, req.params.assignmentAbbr).then(function(_assignment) {
      res.render('assignment_edit', {
        user: req.user,
        course_label: req.params.courseLabel,
        assignment: _assignment
      });
    });
  },

  homepage: function(req, res, next) {
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
  },

  new: function(req, res, next) {
    // app.get('/:username/:courseLabel/assignment', isStaff, assignment.new);
    res.render('assignment_edit', {
      user: req.user,
      course_label: req.params.courseLabel
    });
  },

  update: function(req, res, next) {
    // app.post('/:username/:courseLabel/:assignmentAbbr', isStaff, assignment.update);
    assignmentHelper.update(req.params.courseLabel,
                              req.params.assignmentAbbr,
                              req.body).then(function(_assignment) {
      res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel + '/' + _assignment.abbr);
    });
  }
};

// Protect these routes behind authentication
router.use(passport.authenticate('gitlab', { failureRedirect: '/login' }));

// Connect the routes to handlers
router.get('/:username/:courseLabel/assignment', middleware.isStaff, routes.new);
router.post('/:username/:courseLabel/assignment', middleware.isStaff, routes.create);
router.get('/:username/:courseLabel/:assignmentAbbr', routes.homepage);
router.post('/:username/:courseLabel/:assignmentAbbr', middleware.isStaff, routes.update);
router.post('/:username/:courseLabel/:assignmentAbbr/delete', middleware.isStaff, routes.delete);
router.get('/:username/:courseLabel/:assignmentAbbr/edit', middleware.isStaff, routes.edit);

module.exports = {
  router: router,
  routes: routes
};
