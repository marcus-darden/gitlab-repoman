var models = require('../models');

module.exports = {
  create: function(user_id, course_label, course_name) {
    var user, course;

    return models.User.findById(user_id).then(function(_user) {
      user = _user;

      return models.Course.create({
        label: course_label,
        name: course_name
      });
    }).then(function(_course) {
      course = _course;

      return user.addCourse(course, { gitlab_role: 50 });
    }).then(function() {
      return course;
    });
  },

  getByLabel: function(course_label) {
    return models.Course.findOne({
      where: { label: course_label }
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
