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
            directory: './migrations/seeds/test'
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
            directory: './migrations/seeds/test'
        },
        useNullAsDefault: true
    },

    docker: {
        client: 'mysql',
        connection: {
            host: '0.0.0.0',
            database: 'goals',
            user: 'goals',
            password: 'pwd',
            port: 3306
        },
        pool: {
            min: 1,
            max: 5
        },
        migrations: {
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: './migrations/seeds/demo'
        }
    },

    production: {
        client: 'mysql',
        connection: {
            host: 'u3y93bv513l7zv6o.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
            database: 'c5ppg8gr86kuusso',
            user: 'nvyuivdm1jxu1ew6',
            password: 'it6wxh4qn65n2rie',
            port: 3306        },
        pool: {
            min: 1,
            max: 5
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
};
