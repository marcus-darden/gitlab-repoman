'use strict';

var express = require('express');
var passport = require('passport');
var models = require('../models');
var userHelper = require('../helpers/user');
var courseHelper = require('../helpers/course');
var gitlabHelper = require('../helpers/gitlab');
var middleware = require('../helpers/middleware');

function create(req, res, next) {
  // app.post('/:username/course', isOwner, create);
  var course;
  courseHelper.create(req.user.id, req.body).then(function(_course) {
    course = _course;
    return gitlabHelper.createGroup(req.user.oauth_token, course);
  }).then(function(_group) {
    return course.update({ gitlab_group_id: _group.id });
  }).then(function() {
    res.redirect(303, '/' + req.user.username + '/' + course.label);
  });
}

function deleteCourse(req, res, next) {
  // app.post('/:username/:courseLabel/delete', isOwner, deleteCourse);
  courseHelper.deleteCourse(req.params.courseLabel).then(function() {
    res.redirect(303, '/' + req.params.username);
  });
}

function edit(req, res, next) {
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
}

function homepage(req, res, next) {
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
}

function newCourse(req, res, next) {
  // app.get('/:username/course', isOwner, newCourse);
  res.render('course_edit', {
    user: req.user,
  });
}

function rosterEdit(req, res, next) {
  // app.get('/:username/:courseLabel/roster/edit', isStaff, rosterEdit);
  res.render('stub', req.params);
}

function rosterUpdate(req, res, next) {
  // app.post('/:username/:courseLabel/roster', isStaff, rosterUpdate);
  let users, course, promises;
  let uniqnames = req.body.students.trim().toLowerCase();

  if (!uniqnames.length) {
    return;
  }
  uniqnames = uniqnames.split(/[.,;\s]+/);

  userHelper.getUsers(uniqnames).then(function(_dbUsers) {
    promises = _dbUsers.map((dbUser) => gitlabHelper.setGitlabUserId(req.user.oauth_token, dbUser));
    return Promise.all(promises);
  }).then(function(_users) {
    users = _users;
    return courseHelper.addUsers(req.params.courseLabel, _users, 30);
  }).then(function() {
    res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel);
  });
}

function staffEdit(req, res, next) {
  // app.get('/:username/:courseLabel/staff/edit', isStaff, staffEdit);
  res.render('stub', req.params);
}

function staffUpdate(req, res, next) {
  // app.post('/:username/:courseLabel/staff', isStaff, staffUpdate);
  var users, course, promises;
  var uniqnames = req.body.members.trim().toLowerCase();

  // Condition the usernames input
  if (!uniqnames.length) {
    return;
  }
  uniqnames = uniqnames.split(/[.,;\s]+/);

  // This is how we update the staff
  // 1. Find the users in the DB
  // 2. Associate all users with course in the DB
  // 3. Associate existing GL users with group on GL
  userHelper.getUsers(uniqnames).then(function(_dbUsers) {
    promises = _dbUsers.map((dbUser) => gitlabHelper.setGitlabUserId(req.user.oauth_token, dbUser));
    return Promise.all(promises);
  }).then(function(_users) {
    users = _users;
    return courseHelper.addUsers(req.params.courseLabel, _users, 40);
  }).then(function(_course) {
    course = _course;
    return gitlabHelper.addGroupMembers(req.user.oauth_token, course, users);
  }).then(function() {
      res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel);
  });
}

function update(req, res, next) {
  // app.post('/:username/:courseLabel', isStaff, update);
  courseHelper.update(req.params.courseLabel, req.body).then(function(_course) {
    res.redirect(303, '/' + req.params.username + '/' + _course.label);
  });
}

// Connect the routes to handlers
// Protect these routes behind ownership
// mount at /:username/course
var createRouter = express.Router({ mergeParams: true });
createRouter.use(middleware.isOwner);
createRouter.get('/', newCourse);
createRouter.post('/', create);

// Connect the routes to handlers
// Protect these routes behind authentication
// mount at /:username/:courseLabel
var router = express.Router({ mergeParams: true });
router.use(middleware.isAuthenticated);
router.get('/', homepage);
router.post('/', middleware.isStaff, update);
router.post('/delete', middleware.isOwner, deleteCourse);
router.get('/edit', middleware.isStaff, edit);
router.post('/roster', middleware.isStaff, rosterUpdate);
router.post('/staff', middleware.isStaff, staffUpdate);
router.get('/roster/edit', middleware.isStaff, rosterEdit);
router.get('/staff/edit', middleware.isStaff, staffEdit);

module.exports = {
  createRouter,
  router,
  routes: {
    create,
    deleteCourse,
    edit,
    homepage,
    newCourse,
    rosterEdit,
    rosterUpdate,
    staffEdit,
    staffUpdate,
    update,
  },
};
