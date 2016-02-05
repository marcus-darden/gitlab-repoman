'use strict';
module.exports = function(sequelize, DataTypes) {
  var Assignment = sequelize.define('Assignment', {
    name: DataTypes.STRING,
    gitlab_group_id: DataTypes.INTEGER
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Assignment.belongsToMany(models.Team, {
          through: 'team_assignment'
        });
        Assignment.belongsTo(models.Course, {});
      }
    }
  });
  return Assignment;
};
