var models = require('../models');
var helpers = require('../helpers');

var courseModule = {
  new: function(req, res, next) {
    // app.get('/:username/course', isOwner, course.new);
    res.render('course_edit', {
      params: req.params
    });
  },

  create: function(req, res, next) {
    // app.post('/:username/course', isOwner, course.create);
    console.log('COURSE CREATE');

    // Clean course number
    var number = req.body.department.toLowerCase().replace(' ', '')
                 + '-' + req.body.number.toLowerCase().replace(' ', '');
    if (req.body.section.length)
      number += '-' + req.body.section.toLowerCase().replace(' ', '');

    // Clean semester
    var semester = req.body.semester.toLowerCase();
    if (semester.indexOf('f') > -1)
      semester = 'fall-';
    else if (semester.indexOf('w') > -1)
      semester = 'winter-';
    else if (semester.indexOf('/') > -1)
      semester = 'spring_summer-';
    else if (semester.indexOf('p') > -1)
      semester = 'spring-';
    else if (semester.indexOf('u') > -1)
      semester = 'summer-';
    else
      semester = '';
    semester += req.body.year.toLowerCase().replace(' ', '');
    var label = number + '-' + semester;

    helpers.course.create(req.user.id, label, req.body.name).then(function(_course) {
      res.redirect(303, '/' + req.params.username + '/' + _course.label);
    });
  },

  homepage: function(req, res, next) {
    // app.get('/:username/:courseLabel', isAuthenticated, course.homepage);
    var course, staff, roster, assignments;

    helpers.course.get(req.params.courseLabel).then(function(_course) {
      course = _course;

      staff = helpers.user.getStaff(course.id);
      roster = helpers.user.getRoster(course.id);
      assignments = course.getAssignments();

      return models.Sequelize.Promise.all([
        course,
        staff,
        roster,
        assignments
      ]);
    }).spread(function(_course, _staff, _roster, _assignments) {
      res.render('course', {
        course: _course,
        staff: _staff,
        roster: _roster,
        assignments: _assignments,
        params: req.params
      });
    });
  },

  update: function(req, res, next) {
    // app.post('/:username/:courseLabel', isStaff, course.update);
    res.render('stub', req.params);
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

    helpers.course.get(req.params.courseLabel).then(function(_course) {
      res.render('course_edit', {
        label: label,
        courseName: _course.name,
        params: req.params
      });
    });
  },

  staffEdit: function(req, res, next) {
    // app.get('/:username/:courseLabel/staff/edit', isStaff, course.staffEdit);
    var uniqnames = req.body.members.toLowerCase();
    var users, course;
    uniqnames = uniqnames.split(/[.,;\s]+/);
    helpers.user.getUsers(uniqnames).then(function(_users) {
      helpers.course.addUsers(req.params.courseLabel, _users, 40).then(function() {
        res.redirect(303, '/' + req.params.username + '/' + req.params.courseLabel);
      });
    });
  },

  staffUpdate: function(req, res, next) {
    // app.post('/:username/:courseLabel/staff', isStaff, course.staffUpdate);
    res.render('stub', req.params);
  },

  rosterEdit: function(req, res, next) {
    // app.get('/:username/:courseLabel/roster/edit', isStaff, course.rosterEdit);
    res.render('stub', req.params);
  },

  rosterUpdate: function(req, res, next) {
    // app.post('/:username/:courseLabel/roster', isStaff, course.rosterUpdate);
    res.render('stub', req.params);
  }
};

module.exports = courseModule;
