'use strict';

var models = require('../models');
var userHelper = require('../helpers/user');
var courseHelper = require('../helpers/course');

function getCourseObject(form) {
}

var courseModule = {
  create: function(req, res, next) {
    // app.post('/:username/course', isOwner, course.create);
    courseHelper.create(req.user.id, req.body).then(function(_course) {
      res.redirect(303, '/' + req.params.username + '/' + _course.label);
    });
  },

  delete: function(req, res, next) {
    // app.post('/:username/:courseLabel/delete', isOwner, course.delete);
    courseHelper.delete(req.params.courseLabel).then(function() {
      res.redirect(303, '/' + req.params.username);
    });
  },

  edit: function(req, res, next) {
    // app.get('/:username/:courseLabel/edit', isStaff, course.edit);
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
    // app.get('/:username/:courseLabel', isAuthenticated, course.homepage);
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
    // app.get('/:username/course', isOwner, course.new);
    res.render('course_edit', {
      user: req.user
    });
  },

  rosterEdit: function(req, res, next) {
    // app.get('/:username/:courseLabel/roster/edit', isStaff, course.rosterEdit);
    res.render('stub', req.params);
  },

  rosterUpdate: function(req, res, next) {
    // app.post('/:username/:courseLabel/roster', isStaff, course.rosterUpdate);
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
    // app.get('/:username/:courseLabel/staff/edit', isStaff, course.staffEdit);
    res.render('stub', req.params);
  },

  staffUpdate: function(req, res, next) {
    // app.post('/:username/:courseLabel/staff', isStaff, course.staffUpdate);
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
    // app.post('/:username/:courseLabel', isStaff, course.update);
    courseHelper.update(req.params.courseLabel, req.body).then(function(_course) {
      res.redirect(303, '/' + req.params.username + '/' + _course.label);
    });
  }
};

module.exports = courseModule;
