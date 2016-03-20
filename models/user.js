'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    username: DataTypes.CHAR(8),
    display_name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    gitlab_user_id: DataTypes.INTEGER,
    course_creator: {
      defaultValue: false,
      type: DataTypes.BOOLEAN
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.belongsToMany(models.Team, {
          onDelete: 'cascade',
          through: 'user_team'
        });
        User.belongsToMany(models.Course, {
          onDelete: 'cascade',
          through: models.Role
        });
      }
    }
  });
  return User;
};
