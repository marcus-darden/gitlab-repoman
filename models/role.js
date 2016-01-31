'use strict';
module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define('Role', {
    gitlab_role: DataTypes.INTEGER,
    course_id: DataTypes.INTEGER,
    user_username: DataTypes.CHAR(8)
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Role;
};
