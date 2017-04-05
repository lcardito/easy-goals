
exports.seed = (knex, Promise) => {
    return Promise.join(
        // Inserts seed entries
        knex('bucket').insert({user_id: 99, category: 'Personal', balance: 0, createdDate: '2017-03-25'}),
        knex('bucket').insert({user_id: 99, category: 'Home', balance: 0, createdDate: '2017-03-25'})
    )
};