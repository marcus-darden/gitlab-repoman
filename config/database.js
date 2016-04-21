module.exports = {
  development: {
    username: 'repoman',
    password: 'repoman',
    database: 'repoman_development',
    host: '127.0.0.1',
    dialect: 'postgres',
    define: {
      underscored: true,
      freezeTableName: true,
    },
  },
  test: {
    username: 'repoman',
    password: 'repoman',
    database: 'repoman_test',
    host: '127.0.0.1',
    dialect: 'postgres',
    define: {
      underscored: true,
      freezeTableName: true,
    },
    logging: false,
  },
  production: {
    username: 'repoman',
    password: 'repoman',
    database: 'repoman_production',
    host: '127.0.0.1',
    dialect: 'postgres',
    define: {
      underscored: true,
      freezeTableName: true,
    },
  },
};
