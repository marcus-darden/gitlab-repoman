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
          foreignKey: 'assignment_id',
          otherKey: 'team_id',
          through: 'team_assignment'
        });
        Assignment.belongsTo(models.Course, { onDelete: 'cascade' });
      }
    }
  });
  return Assignment;
};
