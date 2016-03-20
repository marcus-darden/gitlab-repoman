'use strict';
module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define('role', {
    gitlab_access_level: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  });
  return Role;
};
