'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    id: {
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
        User.belongsToMany(models.Team, {});
        User.belongsToMany(models.Course, {
          foriegnKey: 'user_username',
          otherKey: 'course_id',
          through: models.Role
        });
      }
    }
  });
  return User;
};
