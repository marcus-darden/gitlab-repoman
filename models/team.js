'use strict';
module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define('team', {
    name: DataTypes.STRING,
    gitlab_project_id: DataTypes.INTEGER
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Team.belongsToMany(models.User, {
          through: 'user_team'
        });
        Team.belongsToMany(models.Assignment, {
          through: 'team_assignment'
        });
      }
    }
  });
  return Team;
};
