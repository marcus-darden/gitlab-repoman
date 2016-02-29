'use strict';
module.exports = function(sequelize, DataTypes) {
  var Assignment = sequelize.define('assignment', {
    name: DataTypes.STRING,
    abbr: DataTypes.CHAR(20),
    description: DataTypes.STRING,
    number: DataTypes.INTEGER,
    teamsize: DataTypes.INTEGER,
    create_teams: DataTypes.ENUM('manual', 'random', 'optin'),
    active: DataTypes.BOOLEAN,
    gitlab_group_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Assignment.belongsToMany(models.Team, {
          onDelete: 'restrict',
          through: 'assignment_team'
        });
        Assignment.belongsTo(models.Course, {
          onDelete: 'restrict'
        });
      }
    }
  });
  return Assignment;
};
