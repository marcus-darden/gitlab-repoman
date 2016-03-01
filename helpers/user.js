var Sequelize = require('sequelize');
var models = require('../models');

module.exports = {
  getAllCourses: function(user_id) {
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
    return Sequelize.Promise.all([taught, taken]);
  },

  getCoursesTaught: function(user_id) {
    return models.Course.findAll({
      include: [{
        model: models.User,
        where: { id: user_id },
        through: { where: { gitlab_role: { $gte: 40 } } }
      }]
    });
  },

  getCoursesTaken: function(user_id) {
    return models.Course.findAll({
      include: [{
        model: models.User,
        where: { id: user_id },
        through: { where: { gitlab_role: { $lt: 40 } } }
      }]
    });
  },

  createCourse: function(user_id, course_label, course_title) {
    return models.User.findById(user_id).then(function(_user) {
      return models.Course.create({
        label: course_label,
        title: course_title
      }).then(function(_course) {
        return _user.addCourse(_course, { gitlab_role: 50 });
      });
    })
  }
};
