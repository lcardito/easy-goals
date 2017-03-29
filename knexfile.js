// Update with your config settings.

module.exports = {

    test: {
        client: 'sqlite3',
        connection: {
            database: 'goals',
            user: 'goals',
            password: 'pwd',
            filename: ':memory:'
        },
        migrations: {
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: './migrations/seeds/'
        },
        useNullAsDefault: true
    },

    dev: {
        client: 'sqlite3',
        connection: {
            database: 'goals',
            user: 'goals',
            password: 'pwd',
            filename: './dev.db'
        },
        migrations: {
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: './migrations/seeds/'
        },
        useNullAsDefault: true
    },


    production: {
        client: 'mysql2',
        connection: {
            database: 'goals',
            user: 'goals',
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
