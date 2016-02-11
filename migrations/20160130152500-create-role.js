'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('role', {
      user_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(8)
      },
      course_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gitlab_role: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('role');
  }
};
