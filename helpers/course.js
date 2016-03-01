var Sequelize = require('sequelize');
var models = require('../models');

module.exports = {
  getByLabel: function(course_label) {
    return models.Course.findOne({
      where: { label: course_label }
    });
  }
};
