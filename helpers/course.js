'use strict';

var models = require('../models');

function getCourseObject(form) {
  // Get Form Data
  var obj = { name: form.name };

  // Clean course number
  var number = form.department.toLowerCase().replace(' ', '')
               + '-' + form.number.toLowerCase().replace(' ', '');
  if (form.section.length)
    number += '-' + form.section.toLowerCase().replace(' ', '');

  // Clean semester
  var semester = form.semester.toLowerCase();
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
  semester += form.year.toLowerCase().replace(' ', '');

  obj.label = number + '-' + semester;

  return obj;
}

var helpers = {};

helpers.addUsers = function(course_label, users, gitlab_access_level) {
  var course;

  return models.Course.findOne({
    where: { label: course_label }
  }).then(function(_course) {
    course = _course;

    return course.addUsers(users, { gitlab_access_level: gitlab_access_level });
  });
};

helpers.create = function(user_id, form) {
  var user, course;
  var courseOb = getCourseObject(form);

  // Add course to DB
  return models.User.findById(user_id).then(function(_user) {
    user = _user;
    return models.Course.create(courseOb);
  }).then(function(_course) {
    course = _course;
    return user.addCourse(course, { gitlab_access_level: 50 });
  }).then(function() {
    return course;
  });
};

helpers.delete = function(course_label) {
  return models.Course.destroy({
    where: { label: course_label }
  });
};

helpers.get = function(course_label) {
  return models.Course.findOne({
    where: { label: course_label }
  });
};

helpers.getCoursesTaught = function(user_id) {
  return models.Course.findAll({
    include: [{
      model: models.User,
      where: { id: user_id },
      through: { where: { gitlab_access_level: [20, 40, 50] } }
    }]
  });
};

helpers.getCoursesTaken = function(user_id) {
  return models.Course.findAll({
    include: [{
      model: models.User,
      where: { id: user_id },
      through: { where: { gitlab_access_level: 30 } }
    }]
  });
};

helpers.isStaff = function(user_username, course_label) {
  return models.Course.count({
    where: { label: course_label },
    include: [{
      model: models.User,
      where: { username: user_username },
      through: { where: { gitlab_access_level: [20, 40, 50] } }
    }]
  }).then(function(_count) {
    return _count !== 0;
  });
};

helpers.removeUser = function(course_label, username) {
  var course;

  return models.Course.findOne({
    where: { label: course_label }
  }).then(function(_course) {
    course = _course;

    return models.User.findOne({
      where: { username: user_username }
    });
  }).then(function(_user) {
    return course.removeUser(_user);
  });
};

helpers.update = function(course_label, form) {
  var courseOb = getCourseObject(form);

  return models.Course.findOne({
    where: { label: course_label }
  }).then(function(_course) {
    return _course.update(courseOb);
  });
};

module.exports = helpers;
