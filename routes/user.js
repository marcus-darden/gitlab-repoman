var models = require('../models');
var userHelper = require('../helpers/user');

var userModule = {
  homepage: function(req, res, next) {
    // app.get('/:username', isAuthenticated, user.homepage);
    userHelper.getAllCourses(req.user.id).then(function(_values) {
      res.render('user', {
        user: req.user,
        taught: _values[0],
        taken: _values[1],
        params: req.params
      });
    });
  },

  update: function(req, res, next) {
    // app.post('/:username', isOwner, user.update);
    res.render('stub', req.params);
  },

  edit: function(req, res, next) {
    // app.get('/:username/edit', isOwner, user.edit);
    res.render('stub', req.params);
  },

  courseNew: function(req, res, next) {
    // app.get('/:username/course', isOwner, user.courseNew);
    res.render('course_new', req.params);
  },

  courseCreate: function(req, res, next) {
    // app.post('/:username/course', isOwner, user.courseCreate);
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

    models.User.findById(req.user.id).then(function(_user) { // db access maybe unnecessary
      models.Course.create({
        label: label,
        title: req.body.title
      }).then(function(_course) {
        _user.addCourse(_course, { gitlab_role: 50 });
        res.redirect(303, '/' + req.params.username + '/' + _course.label);
      });
    });
  }
};

module.exports = userModule;
