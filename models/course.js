'use strict';
module.exports = function(sequelize, DataTypes) {
  var Course = sequelize.define('Course', {
    number: DataTypes.STRING,
    semester: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Course.hasMany(models.Assignment, { onDelete: 'delete' });
      }
    }
  });
  return Course;
};
