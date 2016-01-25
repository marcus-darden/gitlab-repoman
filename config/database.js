'use strict';

var config = {
  development: {
    username: "repoman",
    password: "repoman",
    database: "repoman_development",
    host: "127.0.0.1",
    dialect: "postgres",
    define: {
      underscored: true,
      freezeTableName: true
    }
  },
  test: {
    username: "repoman",
    password: "repoman",
    database: "repoman_test",
    host: "127.0.0.1",
    dialect: "postgres",
    define: {
      underscored: true,
      freezeTableName: true
    }
  },
  production: {
    username: "repoman",
    password: "repoman",
    database: "repoman_production",
    host: "127.0.0.1",
    dialect: "postgres",
    define: {
      underscored: true,
      freezeTableName: true
    }
  }
};

module.exports = config;
