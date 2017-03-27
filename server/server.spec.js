const request = require('supertest');
const util = require("util");
const assert = require('chai').assert;

describe('loading express', function () {
    let server;

    before(function () {
        server = require('./server');
    });

    it('responds to /api/bucket', () => {
        return request(server)
            .get('/api/bucket')
            .expect(200)
            .then(response => {
                assert.equal(response.body[0].balance, 58, util.inspect(response.body, false, null));
            });
    });

    it('should response the same to /api/bucket', () => {
        return request(server)
            .get('/api/bucket')
            .expect(200)
            .then(response => {
                assert.equal(response.body[0].balance, 58, util.inspect(response.body, false, null));
            });
    });
});