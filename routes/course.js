'use strict';

var express = require('express');
var passport = require('passport');
var models = require('../models');
var userHelper = require('../helpers/user');
var courseHelper = require('../helpers/course');
var middleware = require('../helpers/middleware');

var router = express.Router({ mergeParams: true });
var createRouter = express.Router({ mergeParams: true });

var routes = {};

routes.create = function create(req, res, next) {
  // app.post('/:username/course', isOwner, create);
  courseHelper.create(req.user.id, req.body).then(function(_course) {
    res.redirect(303, '/' + req.params.username + '/' + _course.label);
  });
};

routes.deleteCourse = function deleteCourse(req, res, next) {
  // app.post('/:username/:courseLabel/delete', isOwner, deleteCourse);
  courseHelper.deleteCourse(req.params.courseLabel).then(function() {
    res.redirect(303, '/' + req.params.username);
  });
};

routes.edit = function edit(req, res, next) {
  // app.get('/:username/:courseLabel/edit', isStaff, edit);
  var tokens = req.params.courseLabel.split('-');
  var label = {
    department: tokens[0].toUpperCase(),
    number: tokens[1],
    section: '',
    semester: '',
    year: '',
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
      courseName: _course.name,
    });
  });
};

routes.homepage = function homepage(req, res, next) {
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
      assignments,
    ]);
  }).spread(function(_course, _staff, _roster, _assignments) {
    res.render('course', {
      user: req.user,
      course: _course,
      staff: _staff,
      roster: _roster,
      assignments: _assignments,
    });
  });
};

routes.newCourse = function newCourse(req, res, next) {
  // app.get('/:username/course', isOwner, newCourse);
  res.render('course_edit', {
    user: req.user,
  });
};

routes.rosterEdit = function rosterEdit(req, res, next) {
  // app.get('/:username/:courseLabel/roster/edit', isStaff, rosterEdit);
  res.render('stub', req.params);
};

routes.rosterUpdate = function rosterUpdate(req, res, next) {
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
};

routes.staffEdit = function staffEdit(req, res, next) {
  // app.get('/:username/:courseLabel/staff/edit', isStaff, staffEdit);
  res.render('stub', req.params);
};

routes.staffUpdate = function staffUpdate(req, res, next) {
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
};

routes.update = function update(req, res, next) {
  // app.post('/:username/:courseLabel', isStaff, update);
  courseHelper.update(req.params.courseLabel, req.body).then(function(_course) {
    res.redirect(303, '/' + req.params.username + '/' + _course.label);
  });
};


// Protect these routes behind authentication
// mount at /:username/:courseLabel
router.use(middleware.isAuthenticated);
// mount at /:username/course
createRouter.use(middleware.isOwner);

// Connect the routes to handlers
createRouter.get('/', routes.newCourse);
createRouter.post('/', routes.create);

router.get('/', routes.homepage);
router.post('/', middleware.isStaff, routes.update);
router.post('/delete', middleware.isOwner, routes.deleteCourse);
router.get('/edit', middleware.isStaff, routes.edit);
router.post('/roster', middleware.isStaff, routes.rosterUpdate);
router.post('/staff', middleware.isStaff, routes.staffUpdate);
router.get('/roster/edit', middleware.isStaff, routes.rosterEdit);
router.get('/staff/edit', middleware.isStaff, routes.staffEdit);

module.exports = {
  router: router,
  createRouter: createRouter,
  routes: routes,
};
