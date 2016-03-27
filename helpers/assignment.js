'use strict';

var models = require('../models');

function getAssignmentObject(form) {
  var obj = { name: form.name };
  var abbr, minTeamSize, maxTeamSize, createTeams;

  // Clean assignment abbreviation
  if (form.abbr.length)
    obj.abbr = form.abbr.toLowerCase().replace(' ', '-');
  else
    obj.abbr = form.name.toLowerCase().replace(' ', '-');

  // Clean team creation method and team size variables
  obj.create_teams = form.createTeams.toLowerCase().charAt(0);
  if (obj.create_teams === 'm') {
    obj.create_teams = 'manual';
    obj.min_team_size = 1;
    obj.max_team_size = 0;
  }
  else if (obj.create_teams === 'r') {
    obj.create_teams = 'random';
    obj.max_team_size = Number(form.maxTeamSize) || 2;
    obj.min_team_size = obj.max_team_size - 1;
  }
  else if (obj.create_teams === 's') {
    obj.create_teams = 'solo';
    obj.min_team_size = 1;
    obj.max_team_size = 1;
  }
  else {
    obj.create_teams = 'optin';
    obj.min_team_size = Number(form.minTeamSize) || 2;
    obj.max_team_size = Number(form.maxTeamSize) || obj.min_team_size;
  }

  return obj;
}

var helpers = {};

helpers.create = function create(course_label, form) {
  var course, assignment;
  var assignmentOb = getAssignmentObject(form);

  return models.Course.findOne({
    where: { label: course_label }
  }).then(function(_course) {
    course = _course;
    return models.Assignment.create(assignmentOb);
  }).then(function(_assignment) {
    assignment = _assignment;
    return course.addAssignment(assignment);
  }).then(function() {
    return assignment;
  });
};

helpers.deleteAssignment = function deleteAssignment(course_label, assignment_abbr) {
  return models.Assignment.destroy({
    where: { abbr: assignment_abbr },
    include: [{
      model: models.Course,
      where: { label: course_label },
    }]
  });
};

helpers.get = function get(course_label, assignment_abbr) {
  return models.Assignment.findOne({
    include: [{
      model: models.Course,
      where: { label: course_label },
    }],
    where: { abbr: assignment_abbr },
  });
};

helpers.getUserCourses = function getUserCourses(user_id) {
  var taught = models.Course.findAll({
    include: [{
      model: models.User,
      where: { id: user_id },
      through: { where: { gitlab_access_level: [20, 40, 50] } },
    }],
  });
  var taken = models.Course.findAll({
    include: [{
      model: models.User,
      where: { id: user_id },
      through: { where: { gitlab_access_level: 30 } },
    }],
  });
  return models.sequelize.Promise.all([taught, taken]);
};

helpers.update = function update(course_label, assignment_abbr, form) {
  var assignmentOb = getAssignmentObject(form);

  return models.Assignment.findOne({
    where: { abbr: assignment_abbr },
    include: [{
      model: models.Course,
      where: { label: course_label },
    }],
  }).then(function(_assignment) {
    return _assignment.update(assignmentOb);
  });
};

module.exports = helpers;
