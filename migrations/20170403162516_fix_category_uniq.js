exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('bucket', (table) => {
            table.dropUnique(['category']);
            table.unique(['category', 'user_id']);
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('bucket', (table) => {
            table.dropUnique(['category']);
            table.dropUnique(['category', 'user_id']);
        })
    ]);
};
