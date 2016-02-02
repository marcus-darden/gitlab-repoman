'use strict';
module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define('team', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.CHAR(11)
    },
    name: DataTypes.STRING,
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Team.belongsToMany(models.User, {});
        Team.belongsToMany(models.Assignment, {});
      }
    }
  });
  return Team;
};
