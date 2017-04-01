
exports.seed = (knex, Promise) => {
    return Promise.join(
        // Deletes ALL existing entries
        knex('bucket').del(),

        // Inserts seed entries
        knex('bucket').insert({user_id: 1, category: 'Other', balance: 0, createdDate: '2017-03-25'}),
        knex('bucket').insert({user_id: 0, category: 'Vehicles', balance: 0, createdDate: '2017-03-25'})
    )
};