module.exports = function defineAssignmentModel(Sequelize, DataTypes) {
  const Assignment = Sequelize.define('assignment', {
    name: DataTypes.STRING,
    abbr: DataTypes.STRING,
    description: DataTypes.STRING,
    number: DataTypes.INTEGER,
    min_team_size: DataTypes.INTEGER,
    max_team_size: DataTypes.INTEGER,
    create_teams: {
      defaultValue: 'solo',
      type: DataTypes.ENUM('manual', 'random', 'solo', 'optin'),
    },
    active: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
  }, {
    classMethods: {
      associate(models) {
        Assignment.belongsToMany(models.Team, {
          onDelete: 'restrict',
          through: 'assignment_team',
        });
        Assignment.belongsTo(models.Course, {
          onDelete: 'cascade',
        });
      },
    },
  });
  return Assignment;
};
