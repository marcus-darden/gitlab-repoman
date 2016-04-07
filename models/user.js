module.exports = function defineUserModel(Sequelize, DataTypes) {
  const User = Sequelize.define('user', {
    username: DataTypes.CHAR(8),
    display_name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    gitlab_user_id: DataTypes.INTEGER,
    course_creator: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
  }, {
    classMethods: {
      associate(models) {
        User.belongsToMany(models.Team, {
          onDelete: 'cascade',
          through: 'user_team',
        });
        User.belongsToMany(models.Course, {
          onDelete: 'cascade',
          through: models.Role,
        });
      },
    },
  });
  return User;
};
