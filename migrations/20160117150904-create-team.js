'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('team', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(11)
      },
      name: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.INTEGER
      },
      creator: {
        type: Sequelize.CHAR(8)
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(function () {
      return queryInterface.addColumn('user', 'team_id', {
        type: Sequelize.CHAR(11),
        references: {
          model: 'team',
          key: 'id'
        },
        onDelete: 'restrict',
        onUpdate: 'cascade'
      });
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('user', 'team_id').then(function () {
      return queryInterface.dropTable('team', { cascade: true });
    });
  }
};
