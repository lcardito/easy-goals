
exports.seed = (knex, Promise) => {
    return Promise.join(
        // Deletes ALL existing entries
        knex('bucket').del(),

        // Inserts seed entries
        knex('bucket').insert({category: 'Other', balance: 0, createdDate: '2017-03-25'}),
        knex('bucket').insert({category: 'Vehicles', balance: 0, createdDate: '2017-03-25'})
    )
};