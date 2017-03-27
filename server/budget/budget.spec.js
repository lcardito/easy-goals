'use strict';

const budget = require('./budget');
const util = require("util");
const expect = require('chai').expect;
const assert = require('chai').assert;

describe('budget module', () => {

    it('should export calculateMonthlySaving', () => {
        expect(budget.calculateMonthlySaving).to.be.a('function');
    });

    it('should export report', () => {
        assert.isArray(budget.monthlyReport);
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

    describe('monthly report', () => {

        it('should report on each month saving amount', () => {
            const bucket = {category: 'Other', balance: 0, createdDate: '2017-03-25', id: 0};
            const goals = [{id: 6, category: 'Other', label: 'Phone', cost: 400, date: '2017-05-30'}];

            assert.equal(budget.calculateMonthlySaving(bucket, goals), 200);

            assert.lengthOf(budget.monthlyReport, 3, util.inspect(budget.monthlyReport, false, null));

            let firstPayment = budget.monthlyReport[0];
            assert.equal(firstPayment.date, '2017-03-25');
            assert.equal(firstPayment.payIn, 200);
            assert.equal(firstPayment.payOut, 0);
            assert.equal(firstPayment.balance, 200);

            let secondPayment = budget.monthlyReport[1];
            assert.equal(secondPayment.date, '2017-04-25');
            assert.equal(secondPayment.payIn, 200);
            assert.equal(secondPayment.payOut, 0);
            assert.equal(secondPayment.balance, 400);

            let lastPayment = budget.monthlyReport[2];
            assert.equal(lastPayment.date, '2017-05-25');
            assert.equal(lastPayment.payIn, 0);
            assert.equal(lastPayment.payOut, 400);
            assert.equal(lastPayment.balance, 0);
        });

    });
});