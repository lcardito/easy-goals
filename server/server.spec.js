"use strict";

const request = require('supertest');
const util = require("util");
const assert = require('chai').assert;

describe('integration tests', () => {
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

    describe('migration tests', () => {
        it('should run buckets migrations', (done) => {
            knex('bucket').select().then((allBuckets) => {

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
    });

    describe('user is authenticated', () => {
        let user1, user2, host;

        before((done) => {
            let request = require('superagent');
            host = 'http://localhost:' + server.get('port');

            user1 = request.agent();
            user2 = request.agent();

            user1.post(host + '/login')
                .send({'email': 'gigo@gigio.com', 'password': 'password'})
                .then((response) => {
                    assert.equal(response.body.username, 'luigi');
                    user1.id = response.body.id;

                    user2.post(host + '/login')
                        .send({'email': 'andrea@andy.com', 'password': 'andrea'})
                        .then((response) => {
                            assert.equal(response.body.username, 'andrea');
                            user2.id = response.body.id;
                            done();
                        });
                });
        });

        it('user1 should see only own goals', (done) => {
            user1.get(host + '/api/goals')
                .then((response) => {
                    assert.lengthOf(response.body, 6);
                    done();
                });

        });

        it('user2 should see only own goals', (done) => {
            user2.get(host + '/api/goals')
                .then((response) => {
                    assert.lengthOf(response.body, 1);
                    done();
                });

        });

        it('should add bucket for the goal if its category does not exists', (done) => {
            user1.post(host + '/api/goals')
                .send({
                    category: 'NewCategory',
                    label: 'Bike exhaust',
                    cost: 500,
                    dueDate: '2017-06-30'
                })
                .then(response => {
                    assert.equal(response.body[0].label, 'Bike exhaust', util.inspect(response.body, false, null));

                    knex('bucket').where({category: 'NewCategory'}).select().then((result) => {
                        assert.lengthOf(result, 1);
                        done();
                    })
                });
        });

        it('user1 should see own buckets', (done) => {
            user1
                .get(host + '/api/bucket')
                .then(response => {
                    assert.lengthOf(response.body, 1);
                    assert.equal(response.body[0].balance, 147, util.inspect(response.body, false, null));
                    done();
                });
        });

        it('user2 should see own buckets', (done) => {
            user2
                .get(host + '/api/bucket')
                .then(response => {
                    assert.lengthOf(response.body, 1);
                    assert.equal(response.body[0].balance, 58, util.inspect(response.body, false, null));
                    done();
                });
        });

        it('should save into database on post', (done) => {
            user1.post(host + '/api/goals')
                .send({category: 'Vehicles', label: 'Bike exhaust', cost: 500, dueDate: '2017-06-30'})
                .then(response => {
                    assert.equal(response.body[0].label, 'Bike exhaust', util.inspect(response.body, false, null));
                    done();
                });
        });

        it('should update into database on put', (done) => {
            user1.put(host + '/api/goals')
                .send({id: 0, category: 'NewVehicles', label: 'Bike exhaust', cost: 500, dueDate: '2017-06-30'})
                .then(response => {
                    assert.equal(response.body[0].id, 0, util.inspect(response, false, null));
                    assert.equal(response.body[0].category, 'NewVehicles', util.inspect(response, false, null));

                    done();
                });
        });

        it('user1 should delete own goal on delete', (done) => {
            knex('goal')
                .where('user_id', user1.id)
                .select()
                .limit(1)
                .then((result) => {
                    user1.del(host + '/api/goals/' + result[0].id)
                        .then(() => {
                            knex('goal')
                                .where('user_id', user1.id)
                                .select()
                                .then((goals) => {
                                    assert.lengthOf(goals, 5);
                                    done();
                                })
                        });
                });
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