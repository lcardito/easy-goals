'use strict';

const bucket = require('./bucket');
const assert = require('chai').assert;

describe('bucket module', () => {

    describe('can get buckets', () => {

        it('getBuckets function exists', () => {
            assert.isFunction(bucket.getBuckets);
        })
    });

});