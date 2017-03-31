exports.seed = (knex, Promise) => {
    return Promise.join(
        // Deletes ALL existing entries
        knex('user').del(),

        // Inserts seed entries
        knex('user').insert({username: 'luigi', email: 'gigo@gigio.com', password: '$2a$10$nyqhHgxfXY1WQoegNzsTNeHnvFguzn1gOQIMnVb62Wmg74QwywloC', createdDate: '2017-06-30' }),
        knex('user').insert({username: 'andrea', email: 'andrea@andy.com', password: 'blabla', createdDate: '2017-06-30' })
    )
};