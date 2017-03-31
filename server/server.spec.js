const request = require('supertest');
const util = require("util");
const assert = require('chai').assert;

describe('integration tests', function () {
    let server;
    let knex;

    before((done) => {
        server = require('./server').app;
        server.on('ready', () => {
            console.log('Server up and running');
            knex = require('./server').knex;
            done();
        });
    });

    beforeEach(() => {
        knex('goal').del();
        knex('bucket').del();

        return knex.seed.run();
    });

    it('should run buckets migrations', (done) => {
        knex('bucket').select().then((allBuckets) => {
            "use strict";

            assert.isDefined(allBuckets);
            assert.lengthOf(allBuckets, 2);

            done();
        });
    });

    it('should run goal migrations', (done) => {
        knex('goal').select().then((allGoals) => {
            "use strict";

            assert.isDefined(allGoals);
            assert.lengthOf(allGoals, 7);

            done();
        });
    });

    it('responds to /api/bucket', () => {
        return request(server)
            .get('/api/bucket')
            .expect(200)
            .then(response => {
                assert.equal(response.body[0].balance, 147, util.inspect(response.body, false, null));
            });
    });

    it('should save into database on post', () => {
        return request(server)
            .post('/api/goals')
            .send({category: 'Vehicles', label: 'Bike exhaust', cost: 500, dueDate: '2017-06-30'})
            .expect(200)
            .then(response => {
                assert.equal(response.body[0].label, 'Bike exhaust', util.inspect(response.body, false, null));
            });
    });

    it('should update into database on put', () => {
        return request(server)
            .put('/api/goals')
            .send({id: 0, category: 'NewVehicles', label: 'Bike exhaust', cost: 500, dueDate: '2017-06-30'})
            .expect(200)
            .then(response => {
                assert.equal(response.body[0].id, 0, util.inspect(response, false, null));
                assert.equal(response.body[0].category, 'NewVehicles', util.inspect(response, false, null));
            });
    });

    it('should delete into database on delete', (done) => {
        knex('goal').select().limit(1).then((result) => {
            request(server)
                .del('/api/goals/' + result[0].id)
                .expect(200)
                .then(() => {
                    knex('goal').select().then((goals) => {
                        assert.lengthOf(goals, 6);
                        done();
                    })
                });
        });
    });

    it('should response the same to /api/bucket', () => {
        return request(server)
            .get('/api/bucket')
            .expect(200)
            .then(response => {
                assert.equal(response.body[0].balance, 147);
            });
    });

    it('should add bucket for the goal if its category does not exists', (done) => {
        request(server)
            .post('/api/goals')
            .send({category: 'NewCategory', label: 'Bike exhaust', cost: 500, dueDate: '2017-06-30'})
            .expect(200)
            .then(response => {
                assert.equal(response.body[0].label, 'Bike exhaust', util.inspect(response.body, false, null));

                knex('bucket').where({category: 'NewCategory'}).select().then((result) => {
                    assert.lengthOf(result, 1);
                    done();
                })
            });
    });

    it('should be able to authenticate', (done) => {
        request(server)
            .post('/login')
            .type('form')
            .expect(200)
            .send({'email': 'gigo@gigio.com', 'password': 'password'})
            .then((response) => {
                assert.equal(response.body.username, 'luigi');
                done();
            });
    });

    it('401 for an unauthorized user', () => {
        return request(server)
            .post('/login')
            .type('form')
            .expect(401)
            .send({'email': 'fake@unknown.com', 'password': 'blabla'});
    });

});