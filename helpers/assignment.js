const models = require('../models');

const helpers = module.exports = {};

function getAssignmentObject(form) {
  const obj = { name: form.name };

  // Clean assignment abbreviation
  if (form.abbr.length) {
    obj.abbr = form.abbr.toLowerCase().replace(' ', '-');
  }
  else {
    obj.abbr = form.name.toLowerCase().replace(' ', '-');
  }

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

helpers.create = function create(courseLabel, form) {
  const assignmentOb = getAssignmentObject(form);

  return models.Course.findOne({
    where: { label: courseLabel },
  }).then(_course => _course.createAssignment(assignmentOb));
};

helpers.deleteAssignment = function deleteAssignment(courseLabel, assignmentAbbr) {
  return models.Assignment.destroy({
    where: { abbr: assignmentAbbr },
    include: [{
      model: models.Course,
      where: { label: courseLabel },
    }],
  });
};

helpers.get = function get(courseLabel, assignmentAbbr) {
  return models.Assignment.findOne({
    include: [{
      model: models.Course,
      where: { label: courseLabel },
    }],
    where: { abbr: assignmentAbbr },
  });
};

helpers.getUserCourses = function getUserCourses(userId) {
  return Promise.all([
    // Courses taken
    models.Course.findAll({
      include: [{
        model: models.User,
        where: { id: userId },
        through: { where: { gitlab_access_level: 30 } },
      }],
    }),

    // Courses taught
    models.Course.findAll({
      include: [{
        model: models.User,
        where: { id: userId },
        through: { where: { gitlab_access_level: [20, 40, 50] } },
      }],
    }),
  ]);
};

helpers.update = function update(courseLabel, assignmentAbbr, form) {
  const assignmentOb = getAssignmentObject(form);

  return models.Assignment.findOne({
    where: { abbr: assignmentAbbr },
    include: [{
      model: models.Course,
      where: { label: courseLabel },
    }],
  }).then(_assignment => _assignment.update(assignmentOb));
};
