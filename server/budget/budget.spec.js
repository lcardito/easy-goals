'use strict';

const budget = require('./budget');
const expect = require('chai').expect;
const assert = require('chai').assert;

describe('budget module', () => {

    it('should export calculateMonthlySaving', () => {
        expect(budget.calculateMonthlySaving).to.be.a('function');
    });

    it('should have private function', () => {
        //noinspection BadExpressionStatementJS
        expect(budget.getInitialSavings).to.be.undefined;
    });

    describe('calculateMonthlySaving', () => {

        it('should return 0 for a bucket with enough balance', () => {
            const bucket = {category: 'Other', balance: 400, createdDate: '2017-03-25', id: 0};
            const goals = [{id: 6, category: 'Other', label: 'Phone', cost: 400, date: '2017-10-30'}];

            assert.equal(budget.calculateMonthlySaving(bucket, goals), 0);
        });

        it('should should use start balance to calculate monthly savings', () => {
            const bucket = {category: 'Other', balance: 100, createdDate: '2017-03-25', id: 0};
            const goals = [{id: 6, category: 'Other', label: 'Phone', cost: 400, date: '2017-10-30'}];

            assert.equal(budget.calculateMonthlySaving(bucket, goals), 43);
        });

        it('should return the round up monthly payment for only one goal', () => {
            const bucket = {category: 'Other', balance: 0, createdDate: '2017-03-25', id: 0};
            const goals = [{id: 6, category: 'Other', label: 'Phone', cost: 400, date: '2017-10-30'}];

            assert.equal(budget.calculateMonthlySaving(bucket, goals), 58);
        });

    });
});