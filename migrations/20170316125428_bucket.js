exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('bucket', (table) => {
            table.increments('id').primary();
            table.string('user_id').notNullable();
            table.foreign('user_id').references('user.id');
            table.string('category');
            table.float('balance');
            table.timestamp('createdDate');
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('bucket')
    ]);
};
