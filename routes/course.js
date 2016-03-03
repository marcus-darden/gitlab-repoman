var models = require('../models');
var helpers = require('../helpers');

var courseModule = {
  new: function(req, res, next) {
    // app.get('/:username/course', isOwner, course.new);
    res.render('course_new', {
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
    helpers.course.getByLabel(req.params.courseLabel).then(function(_course) {
      _course.getAssignments().then(function(_assignments) {
        res.render('course', {
          course: _course,
          assignments: _assignments,
          params: req.params
        });
      });
    });
  },

  update: function(req, res, next) {
    // app.post('/:username/:courseLabel', isStaff, course.update);
    res.render('stub', req.params);
  },

  edit: function(req, res, next) {
    // app.get('/:username/:courseLabel/edit', isStaff, course.edit);
    res.render('stub', req.params);
  },

  staffEdit: function(req, res, next) {
    // app.get('/:username/:courseLabel/staff/edit', isStaff, course.staffEdit);
    res.render('stub', req.params);
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
