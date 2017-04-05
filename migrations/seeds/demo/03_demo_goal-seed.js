exports.seed = (knex, Promise) => {
    return Promise.join(
        // Deletes ALL existing entries
        knex('payment').del(),

        // Inserts seed entries
        knex('payment').insert({user_id: 99, type: 'OUT', category: 'Personal', label: 'Personal Goal 1', amount: 90, dueDate: '2017-06-30'}),
        knex('payment').insert({user_id: 99, type: 'OUT', category: 'Personal', label: 'Personal Goal 2', amount: 300, dueDate: '2017-06-30'}),
        knex('payment').insert({user_id: 99, type: 'OUT', category: 'Personal', label: 'Personal Goal 3', amount: 111, dueDate: '2018-02-28'}),
        knex('payment').insert({user_id: 99, type: 'OUT', category: 'Personal', label: 'Personal Goal 4', amount: 130, dueDate: '2017-07-30'}),
        knex('payment').insert({user_id: 99, type: 'OUT', category: 'Personal', label: 'Personal Goal 5', amount: 90, dueDate: '2017-09-30'}),
        knex('payment').insert({user_id: 99, type: 'OUT', category: 'Personal', label: 'Personal Goal 6', amount: 565, dueDate: '2017-10-30'}),

        knex('payment').insert({user_id: 99, type: 'OUT', category: 'Home', label: 'Home Goal 1', amount: 110, dueDate: '2017-07-30'}),
        knex('payment').insert({user_id: 99, type: 'OUT', category: 'Home', label: 'Home Goal 2', amount: 210, dueDate: '2017-09-30'}),
        knex('payment').insert({user_id: 99, type: 'OUT', category: 'Home', label: 'Home Goal 3', amount: 60, dueDate: '2017-10-30'})
    )
};