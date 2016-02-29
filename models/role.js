'use strict';
module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define('role', {
    gitlab_role: DataTypes.INTEGER
  });
  return Role;
};
