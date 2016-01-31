'use strict';
module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define('team', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.CHAR(11)
    },
    name: DataTypes.STRING,
    size: DataTypes.INTEGER,
    creator: DataTypes.CHAR(8)
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Team.belongsToMany(models.User, {
          foreignKey: 'team_id',
          otherKey: 'user_username',
          through: 'user_team'
        });
        Team.belongsToMany(models.Assignment, {
          foriegnKey: 'team_id',
          otherKey: 'assignment_id',
          through: 'team_assignment'
        });
      }
    }
  });
  return Team;
};
