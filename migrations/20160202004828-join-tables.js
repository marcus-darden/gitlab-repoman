'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('team_assignment', {
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      team_id: {
        allowNull: false,
        onDelete: 'restrict',
        onUpdate: 'cascade',
        primaryKey: true,
        references: { model: 'team' },
        type: Sequelize.INTEGER
      },
      assignment_id: {
        allowNull: false,
        onDelete: 'restrict',
        onUpdate: 'cascade',
        primaryKey: true,
        references: { model: 'assignment' },
        type: Sequelize.INTEGER
      }
    }).then(function() {
      return queryInterface.createTable('user_team', {
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        user_id: {
          allowNull: false,
          onDelete: 'restrict',
          onUpdate: 'cascade',
          primaryKey: true,
          references: { model: 'user' },
          type: Sequelize.INTEGER
        },
        team_id: {
          allowNull: false,
          onDelete: 'restrict',
          onUpdate: 'cascade',
          primaryKey: true,
          references: { model: 'team' },
          type: Sequelize.INTEGER
        }
      }).then(function() {
        return queryInterface.createTable('role', {
          user_id: {
            allowNull: false,
            onDelete: 'restrict',
            onUpdate: 'cascade',
            primaryKey: true,
            references: { model: 'user' },
            type: Sequelize.INTEGER
          },
          course_id: {
            allowNull: false,
            onDelete: 'restrict',
            onUpdate: 'cascade',
            primaryKey: true,
            references: { model: 'course' },
            type: Sequelize.INTEGER
          },
          gitlab_role: {
            allowNull: false,
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
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('user');
    */
  }
};
