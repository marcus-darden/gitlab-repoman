module.exports = function defineRoleModel(Sequelize, DataTypes) {
  const Role = Sequelize.define('role', {
    gitlab_access_level: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  });
  return Role;
};
