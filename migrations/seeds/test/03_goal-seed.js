exports.seed = (knex, Promise) => {
    return Promise.join(
        // Deletes ALL existing entries
        knex('payment').del(),

        // Inserts seed entries
        knex('payment').insert({user_id: 0, type: 'OUT', category: 'Vehicles', label: 'Bike - MOT', amount: 90, dueDate: '2017-06-30'}),
        knex('payment').insert({user_id: 0, type: 'OUT', category: 'Vehicles', label: 'Car - Maintenance', amount: 300, dueDate: '2017-06-30'}),
        knex('payment').insert({user_id: 0, type: 'OUT', category: 'Vehicles', label: 'AA', amount: 111, dueDate: '2018-02-28'}),
        knex('payment').insert({user_id: 0, type: 'OUT', category: 'Vehicles', label: 'Car - Road Tax', amount: 130, dueDate: '2017-07-30'}),
        knex('payment').insert({user_id: 0, type: 'OUT', category: 'Vehicles', label: 'Car - MOT', amount: 90, dueDate: '2017-09-30'}),
        knex('payment').insert({user_id: 0, type: 'OUT', category: 'Vehicles', label: 'Car - Insurance', amount: 565, dueDate: '2017-10-30'}),

        knex('payment').insert({user_id: 1, type: 'OUT', category: 'Other', label: 'Phone', amount: 400, dueDate: '2017-10-30'})
    )
};