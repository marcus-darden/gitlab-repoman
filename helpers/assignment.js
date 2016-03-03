var models = require('../models');

module.exports = {
  create: function(course_label, assignment_name, assignment_abbr,
                   assignment_min_team_size, assignment_max_team_size,
                   assignment_create_teams) {
    var course, assignment;
    return models.Course.findOne({
      where: { label: course_label }
    }).then(function(_course) {
      course = _course;

      return models.Assignment.create({
        name: assignment_name,
        abbr: assignment_abbr,
        min_team_size: assignment_min_team_size,
        max_team_size: assignment_max_team_size,
        create_teams: assignment_create_teams
      });
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
  }
};
