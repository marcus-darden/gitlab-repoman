'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface('DROP COLUMN', 'size');
    queryInterface('DROP COLUMN', 'creator');
    queryInterface('ADD COLUMN', 'gitlab_project_id', Sequelize.INTEGER);
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
