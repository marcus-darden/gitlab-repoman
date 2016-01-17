'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('user', {
      username: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(8)
      },
      display_name: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      },
      team_id: {
        type: Sequelize.CHAR(11)
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
    return queryInterface.dropTable('user');
  }
};
