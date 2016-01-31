'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    username: {
      type: DataTypes.CHAR(8),
      allowNull: false,
      primaryKey: true
    },
    display_name: DataTypes.STRING,
    avatar: DataTypes.STRING,
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        User.belongsToMany(models.Team, {
          foreignKey: 'user_username',
          otherKey: 'team_id',
          through: 'user_team'
        });
        User.belongsToMany(models.Course, {
          foriegnKey: 'user_username',
          otherKey: 'course_id',
          through: models.Role // How is the race condition on Role resolved here?
        });
      }
    }
  });
  return User;
};
