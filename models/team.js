module.exports = function defineTeamModel(Sequelize, DataTypes) {
  const Team = Sequelize.define('team', {
    name: DataTypes.STRING,
    gitlab_project_id: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate(models) {
        Team.belongsToMany(models.User, {
          onDelete: 'restrict',
          through: 'user_team',
        });
        Team.belongsToMany(models.Assignment, {
          onDelete: 'restrict',
          through: 'assignment_team',
        });
      },
    },
  });
  return Team;
};
