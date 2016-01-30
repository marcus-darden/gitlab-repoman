'use strict';
module.exports = function(sequelize, DataTypes) {
  var Assignment = sequelize.define('Assignment', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Assignment.hasMany(models.Team, { onDelete: 'restrict' });
      }
    }
  });
  return Assignment;
};
