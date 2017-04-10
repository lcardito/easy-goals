exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.table('bucket', function (table) {
            console.log('Adding column color to table bucket');
            table.string('color').defaultTo('#008080');
        })]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.table('bucket', function (table) {
            table.dropColumn('color');
        })]);
};
