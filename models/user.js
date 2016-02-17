'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    username: DataTypes.CHAR(8),
    display_name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    course_creator: {
      defaultValue: false,
      type: DataTypes.BOOLEAN
    }
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        User.belongsToMany(models.Team, {
          through: 'user_team'
        });
        User.belongsToMany(models.Course, {
          through: models.Role
        });
      }
    }
  });
  return User;
};
