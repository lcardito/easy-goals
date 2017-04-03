exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.renameTable('goal', 'payment').then(() => {
            "use strict";
            return knex.schema.table('payment', function (table) {
                table.renameColumn('cost', 'amount');
                table.string('type').notNullable().defaultTo('OUT');
            })
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.hasTable('payment').then((exists) => {
            if (exists) {
                return knex.schema.table('payment', (t) => {
                    t.renameColumn('amount', 'cost');
                    t.dropColumn('type');
                });
            }
        })
    ]);
};