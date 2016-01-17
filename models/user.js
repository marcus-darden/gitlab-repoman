'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    username: {
      type: DataTypes.CHAR(8),
      allowNull: false,
      primaryKey: true
    },
    display_name: DataTypes.STRING,
    avatar: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        User.belongsTo(models.Team, { onDelete: 'restrict' });
      }
    }
  });
  return User;
};
