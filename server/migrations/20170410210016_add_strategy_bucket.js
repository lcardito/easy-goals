exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.table('bucket', function (table) {
            console.log('Adding column strategy to table bucket');
            table.string('strategy').defaultTo('fixed');//or relaxed
        })]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.table('bucket', function (table) {
            table.dropColumn('strategy');
        })]);
};
