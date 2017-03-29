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

    it('should run migrations', (done) => {
        knex('bucket').select().then((allBuckets) => {
            "use strict";

            assert.isDefined(allBuckets);
            assert.lengthOf(allBuckets, 1);

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

    it('should response the same to /api/bucket', () => {
        return request(server)
            .get('/api/bucket')
            .expect(200)
            .then(response => {
                assert.equal(response.body[0].balance, 147);
            });
    });
});