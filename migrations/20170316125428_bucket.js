exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('bucket', (table) => {
            table.increments('id').primary().unsigned();
            table.integer('user_id').unsigned().references('id').inTable('user');
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
