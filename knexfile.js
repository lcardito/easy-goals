// Update with your config settings.

module.exports = {
  production: {
    client: 'mysql2',
    connection: {
      database: 'goals',
      user:     'goals',
      password: 'pwd'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
