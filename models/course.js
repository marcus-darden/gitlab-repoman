'use strict';
module.exports = function(sequelize, DataTypes) {
  var Course = sequelize.define('Course', {
    number: DataTypes.STRING,
    semester: DataTypes.STRING
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Course.hasMany(models.Assignment, { onDelete: 'delete' });
        Course.belongsToMany(models.User, {
          as: { singular: 'Staffer', plural: 'Staff' },
          foreignKey: 'course_id',
          otherKey: 'user_username',
          through: models.Role // How is the race condition on Role resolved here?
        });
      }
    }
  });
  return Course;
};
