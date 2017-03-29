exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('bucket', (table) => {
            table.increments('id').primary();
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
