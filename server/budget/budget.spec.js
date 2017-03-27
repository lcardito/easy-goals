'use strict';

const budget = require('./budget');
const util = require("util");
const _ = require("lodash");
const expect = require('chai').expect;
const assert = require('chai').assert;

describe('budget module', () => {

    it('should export calculateMonthlySaving', () => {
        assert.isFunction(budget.calculateMonthlySaving);
    });

    it('should export report', () => {
        assert.isArray(budget.monthlyReport);
    });

    it('should have private function', () => {
        assert.isUndefined(budget.getInitialSavings);
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
            assert.equal( _.sumBy(firstPayment.payments, 'cost'), 0);
            assert.equal(firstPayment.balance, 200);

            let secondPayment = budget.monthlyReport[1];
            assert.equal(secondPayment.date, '2017-04-25');
            assert.equal(secondPayment.payIn, 200);
            assert.equal( _.sumBy(secondPayment.payments, 'cost'), 0);
            assert.equal(secondPayment.balance, 400);

            let lastPayment = budget.monthlyReport[2];
            assert.equal(lastPayment.date, '2017-05-25');
            assert.equal(lastPayment.payIn, 0);
            assert.equal( _.sumBy(lastPayment.payments, 'cost'), 400);
            assert.equal(lastPayment.balance, 0);
        });

        it('should collapse goal payments on same date', () => {
            const bucket = {category: 'Vehicles', balance: 0, createdDate: '2017-03-25', id: 0};

            let goals = [{id: 0, category: 'Vehicles', label: 'Bike - MOT', cost: 90, date: '2017-06-30'},
                {id: 1, category: 'Vehicles', label: 'Car - Maintenance', cost: 300, date: '2017-06-30'},
                {id: 2, category: 'Vehicles', label: 'AA', cost: 111, date: '2018-02-28'},
                {id: 3, category: 'Vehicles', label: 'Car - Road Tax', cost: 130, date: '2017-07-30'},
                {id: 4, category: 'Vehicles', label: 'Car - MOT', cost: 90, date: '2017-09-30'},
                {id: 5, category: 'Vehicles', label: 'Car - Insurance', cost: 565, date: '2017-10-30'}
            ];

            assert.equal(budget.calculateMonthlySaving(bucket, goals), 155);

            let payOuts = _.filter(budget.monthlyReport, (r) => {
                return (r.payments && r.payments.length !== 0);
            });

            assert.lengthOf(payOuts, 5, util.inspect(payOuts, true, null));
            let firstPayments = payOuts[0].payments;
            assert.lengthOf(firstPayments, 2);
            assert.equal(firstPayments[0].name, 'Bike - MOT');
            assert.equal(firstPayments[1].name, 'Car - Maintenance');

            assert.lengthOf(payOuts[1].payments, 1);
        })

    });
});