'use strict';
module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define('team', {
    name: DataTypes.STRING,
    gitlab_project_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Team.belongsToMany(models.User, {
          onDelete: 'restrict',
          through: 'user_team'
        });
        Team.belongsToMany(models.Assignment, {
          onDelete: 'restrict',
          through: 'assignment_team'
        });
      }
    }
  });
  return Team;
};
