'use strict';

var express = require('express');
var passport = require('passport');
var models = require('../models');
var userHelper = require('../helpers/user');
var courseHelper = require('../helpers/course');
var middleware = require('../helpers/middleware');

var router = express.Router();


var routes = {
  create: function(req, res, next) {
    // app.post('/:username/course', isOwner, create);
    courseHelper.create(req.user.id, req.body).then(function(_course) {
      res.redirect(303, '/' + req.params.username + '/' + _course.label);
    });
  },

  delete: function(req, res, next) {
    // app.post('/:username/:courseLabel/delete', isOwner, delete);
    courseHelper.delete(req.params.courseLabel).then(function() {
      res.redirect(303, '/' + req.params.username);
    });
  },

  edit: function(req, res, next) {
    // app.get('/:username/:courseLabel/edit', isStaff, edit);
    var tokens = req.params.courseLabel.split('-');
    var label = {
      department: tokens[0].toUpperCase(),
      number: tokens[1],
      section: '',
      semester: '',
      year: ''
    };
    if (tokens.length === 4) {
      label.semester = tokens[2];
      label.year = tokens[3];
    }
    else if (tokens.length === 5) {
      label.section = tokens[2];
      label.semester = tokens[3];
      label.year = tokens[4];
    }
    if (label.semester)
      label.semester = label.semester.charAt(0).toUpperCase()
                       + label.semester.slice(1);

    courseHelper.get(req.params.courseLabel).then(function(_course) {
      res.render('course_edit', {
        user: req.user,
        label: label,
        courseName: _course.name
      });
    });
  },

  homepage: function(req, res, next) {
    // app.get('/:username/:courseLabel', isAuthenticated, homepage);
    var course, staff, roster, assignments;

    courseHelper.get(req.params.courseLabel).then(function(_course) {
      course = _course;

      staff = userHelper.getStaff(course.id);
      roster = userHelper.getRoster(course.id);
      assignments = course.getAssignments();

      return models.Sequelize.Promise.all([
        course,
        staff,
        roster,
        assignments
      ]);
    }).spread(function(_course, _staff, _roster, _assignments) {
      res.render('course', {
        user: req.user,
        course: _course,
        staff: _staff,
        roster: _roster,
        assignments: _assignments
      });
    });
  },

  new: function(req, res, next) {
    // app.get('/:username/course', isOwner, new);
    res.render('course_edit', {
      user: req.user
    });
  },

  rosterEdit: function(req, res, next) {
    // app.get('/:username/:courseLabel/roster/edit', isStaff, rosterEdit);
    res.render('stub', req.params);
  },

  rosterUpdate: function(req, res, next) {
    // app.post('/:username/:courseLabel/roster', isStaff, rosterUpdate);
    var users, course;
    var uniqnames = req.body.students.trim().toLowerCase();

    if (!uniqnames.length) {
      return;
    }
    uniqnames = uniqnames.split(/[.,;\s]+/);
    userHelper.getUsers(uniqnames).then(function(_users) {
      courseHelper.addUsers(req.params.courseLabel, _users, 30).then(function() {
        res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel);
      });
    });
  },

  staffEdit: function(req, res, next) {
    // app.get('/:username/:courseLabel/staff/edit', isStaff, staffEdit);
    res.render('stub', req.params);
  },

  staffUpdate: function(req, res, next) {
    // app.post('/:username/:courseLabel/staff', isStaff, staffUpdate);
    var users, course;
    var uniqnames = req.body.members.trim().toLowerCase();

    if (!uniqnames.length) {
      return;
    }
    uniqnames = uniqnames.split(/[.,;\s]+/);
    userHelper.getUsers(uniqnames).then(function(_users) {
      courseHelper.addUsers(req.params.courseLabel, _users, 40).then(function() {
        res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel);
      });
    });
  },

  update: function(req, res, next) {
    // app.post('/:username/:courseLabel', isStaff, update);
    courseHelper.update(req.params.courseLabel, req.body).then(function(_course) {
      res.redirect(303, '/' + req.params.username + '/' + _course.label);
    });
  }
};

// Protect these routes behind authentication
router.use(passport.authenticate('gitlab', { failureRedirect: '/login' }));

// Connect the routes to handlers
router.get('/:username/course', middleware.isOwner, routes.new);
router.post('/:username/course', middleware.isOwner, routes.create);
router.get('/:username/:courseLabel', routes.homepage);
router.post('/:username/:courseLabel', middleware.isStaff, routes.update);
router.post('/:username/:courseLabel/delete', middleware.isOwner, routes.delete);
router.get('/:username/:courseLabel/edit', middleware.isStaff, routes.edit);
router.post('/:username/:courseLabel/roster', middleware.isStaff, routes.rosterUpdate);
router.post('/:username/:courseLabel/staff', middleware.isStaff, routes.staffUpdate);
router.get('/:username/:courseLabel/roster/edit', middleware.isStaff, routes.rosterEdit);
router.get('/:username/:courseLabel/staff/edit', middleware.isStaff, routes.staffEdit);

module.exports = {
  router: router,
  routes: routes
};
