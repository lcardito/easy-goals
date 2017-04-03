
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('bucket', (table) => {
            table.unique(['category']);
        })
    ]);
};

exports.down = function(knex, Promise) {
  //Do nothing
};
