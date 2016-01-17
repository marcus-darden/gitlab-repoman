'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    username: {
      type: DataTypes.CHAR(8),
      allowNull: false,
      primaryKey: true
    },
    display_name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    team_id: DataTypes.CHAR(11)
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return user;
};
