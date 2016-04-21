'use strict';

const path = require('path');
const Umzug = require('umzug');

const models = require('../../models');

const queryInterface = models.sequelize.getQueryInterface();
const init = module.exports = {};

const migrator = new Umzug({
  storage: 'sequelize',
  storageOptions: { sequelize: models.sequelize },
  migrations: {
    params: [queryInterface, models.Sequelize],
    path: path.join(__dirname, '../../migrations'),
  },
});

const seeder = new Umzug({
  storage: 'none',
  storageOptions: { sequelize: models.sequelize },
  migrations: {
    params: [queryInterface, models.Sequelize],
    path: path.join(__dirname, '../../seeders'),
    pattern: /\.js$/,
  },
});

init.database = function database() {
  return queryInterface.dropAllTables().then(
    () => migrator.up()
  ).then(
    () => seeder.up('one-of-each')
  );
};
