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

  // Clean team size variables
  obj.min_team_size = Number(form.minTeamSize) || 1;
  obj.max_team_size = Number(form.maxTeamSize) || obj.min_team_size;

  // Clean team creation method
  obj.create_teams = form.createTeams.toLowerCase().charAt(0);
  if (obj.create_teams === 'r')
    obj.create_teams = 'random';
  else if (obj.create_teams === 'o')
    obj.create_teams = 'optin';
  else
    obj.create_teams = 'manual';

  return obj;
}


module.exports = {
  create: function(course_label, form) {
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
  },

  get: function(course_label, assignment_abbr) {
    return models.Assignment.findOne({
      include: [{
        model: models.Course,
        where: { label: course_label }
      }],
      where: { abbr: assignment_abbr }
    });
  },

  getUserCourses: function(user_id) {
    var taught = models.Course.findAll({
      include: [{
        model: models.User,
        where: { id: user_id },
        through: { where: { gitlab_role: { $gte: 40 } } }
      }]
    });
    var taken = models.Course.findAll({
      include: [{
        model: models.User,
        where: { id: user_id },
        through: { where: { gitlab_role: { $lt: 40 } } }
      }]
    });
    return models.sequelize.Promise.all([taught, taken]);
  },

  update: function(course_label, assignment_abbr, form) {
    var assignmentOb = getAssignmentObject(form);

    return models.Assignment.findOne({
      where: { abbr: assignment_abbr },
      include: [{
        model: models.Course,
        where: { label: course_label }
      }]
    }).then(function(_assignment) {
      return _assignment.update(assignmentOb);
    });
  }
};
