
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('goal', (table) => {
            table.increments('id').primary();
            table.string('user_id').notNullable();
            table.foreign('user_id').references('user.id');
            table.string('category');
            table.string('label');
            table.float('cost');
            table.timestamp('dueDate');
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('goal')
    ]);
};