module.exports = function defineCourseModel(Sequelize, DataTypes) {
  const Course = Sequelize.define('course', {
    label: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    name: DataTypes.STRING,
    gitlab_group_id: DataTypes.INTEGER,
    active: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
  }, {
    classMethods: {
      associate(models) {
        Course.hasMany(models.Assignment, {
          onDelete: 'cascade',
        });
        Course.belongsToMany(models.User, {
          onDelete: 'cascade',
          through: models.Role,
        });
      },
    },
  });
  return Course;
};
