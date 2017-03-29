exports.seed = (knex, Promise) => {
    return Promise.join(
        // Deletes ALL existing entries
        knex('goal').del(),

        // Inserts seed entries
        knex('goal').insert({id: 0, category: 'Vehicles', label: 'Bike - MOT', cost: 90, dueDate: '2017-06-30'}),
        knex('goal').insert({id: 1, category: 'Vehicles', label: 'Car - Maintenance', cost: 300, dueDate: '2017-06-30'}),
        knex('goal').insert({id: 2, category: 'Vehicles', label: 'AA', cost: 111, dueDate: '2018-02-28'}),
        knex('goal').insert({id: 3, category: 'Vehicles', label: 'Car - Road Tax', cost: 130, dueDate: '2017-07-30'}),
        knex('goal').insert({id: 4, category: 'Vehicles', label: 'Car - MOT', cost: 90, dueDate: '2017-09-30'}),
        knex('goal').insert({id: 5, category: 'Vehicles', label: 'Car - Insurance', cost: 565, dueDate: '2017-10-30'}),
        knex('goal').insert({id: 6, category: 'Other', label: 'Phone', cost: 400, dueDate: '2017-10-30'})
    )
};