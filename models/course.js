'use strict';
module.exports = function(sequelize, DataTypes) {
  var Course = sequelize.define('course', {
    label: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
    },
    name: DataTypes.STRING,
    active: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN
    }
  }, {
    classMethods: {
      associate: function(models) {
        Course.hasMany(models.Assignment, {
          onDelete: 'cascade'
        });
        Course.belongsToMany(models.User, {
          onDelete: 'cascade',
          through: models.Role
        });
      }
    }
  });
  return Course;
};
