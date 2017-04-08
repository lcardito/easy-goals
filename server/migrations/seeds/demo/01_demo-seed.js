exports.seed = (knex, Promise) => {
    return Promise.join(
        // Inserts seed entries
        knex('user').insert({
            id: 99,
            username: 'demo',
            email: 'demo@demo.com',
            password: '$2a$10$y5SvzTZtUPjPY4tB/NTJYe1bmABcXfsMfm2vmTNpbWLQBmPCbbaza',
            createdDate: '2017-06-30'
        })
    )
};