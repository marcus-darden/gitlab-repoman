'use strict';
module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define('role', {
    gitlab_role: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  });
  return Role;
};
