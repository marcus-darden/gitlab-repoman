'use strict';
module.exports = function(sequelize, DataTypes) {
  var Course = sequelize.define('course', {
    number: DataTypes.STRING,
    semester: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Course.hasMany(models.Assignment, { onDelete: 'delete' });
        Course.belongsToMany(models.User, {
          through: models.Role
        });
      }
    }
  });
  return Course;
};
