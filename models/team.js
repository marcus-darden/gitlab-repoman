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
    classMethods: {
      associate: function(models) {
        Team.hasMany(models.User, { onDelete: 'restrict' });
      }
    }
  });
  return Team;
};
