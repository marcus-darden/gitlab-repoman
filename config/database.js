'use strict';

var config = {
  development: {
    username: "root",
    password: null,
    database: "repoman_development",
    host: "127.0.0.1",
    dialect: "postgres",
    define: {
      underscored: true,
      freezeTableName: true
    }
  },
  test: {
    username: "root",
    password: null,
    database: "repoman_test",
    host: "127.0.0.1",
    dialect: "postgres",
    define: {
      underscored: true,
      freezeTableName: true
    }
  },
  production: {
    username: "root",
    password: null,
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
