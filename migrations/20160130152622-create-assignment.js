'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Assignment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      abbr: {
        type: Sequelize.CHAR(20)
      },
      description: {
        type: Sequelize.STRING
      },
      number: {
        type: Sequelize.INTEGER
      },
      teamsize: {
        type: Sequelize.INTEGER
      },
      create_teams: {
        type: Sequelize.ENUM('manual', 'random', 'optin')
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      gitlab_group_id: {
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
    return queryInterface.dropTable('Assignment');
  }
};
