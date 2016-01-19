'use strict';
module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define('team', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.CHAR(11)
    },
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Team.hasMany(models.User, { onDelete: 'restrict' });
      }
    }
  });
  return Team;
};
