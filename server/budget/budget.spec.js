'use strict';

const budget = require('./budget');
const moment = require('moment');
const util = require("util");
const _ = require("lodash");
const assert = require('chai').assert;

describe('budget module', () => {

    it('should export calculateMonthlySaving', () => {
        assert.isFunction(budget.buildReport);
    });

    it('should have private function', () => {
        assert.isUndefined(budget.getInitialSavings);
    });

    describe('calculateMonthlySaving', () => {

        it('should return no payment in if balance covers the goal', () => {
            const bucket = {category: 'Other', balance: 400, createdDate: '2017-03-25', id: 0};
            const goals = [{id: 6, category: 'Other', label: 'Phone', cost: 400, date: '2017-10-30'}];

            const report = budget.buildReport(bucket, goals);
            assert.lengthOf(report, 8);
            report.forEach((r) => {
                assert.equal(r.payIn, 0);
            });
        });

        it('should should use start balance to calculate monthly savings', () => {
            const bucket = {category: 'Other', balance: 100, createdDate: '2017-03-25', id: 0};
            const goals = [{id: 6, category: 'Other', label: 'Phone', cost: 400, date: '2017-10-30'}];

            const report = budget.buildReport(bucket, goals);
            assert.lengthOf(report, 8, util.inspect(report, false, null));
            assert.equal(report[0].payIn, 43);
            assert.equal(_.sumBy(report, 'payIn'), 301);
        });
    });

    describe('monthly report', () => {

        it('should report on each month saving amount', () => {
            const bucket = {category: 'Other', balance: 0, createdDate: '2017-03-25', id: 0};
            const goals = [{id: 6, category: 'Other', label: 'Phone', cost: 400, date: '2017-05-30'}];

            const report = budget.buildReport(bucket, goals);

            assert.lengthOf(report, 3, util.inspect(report, false, null));

            let firstPayment = report[0];
            assert.equal(firstPayment.date, '2017-03-25');
            assert.equal(firstPayment.payIn, 200);
            assert.equal(_.sumBy(firstPayment.payments, 'cost'), 0);
            assert.equal(firstPayment.balance, 200);

            let secondPayment = report[1];
            assert.equal(secondPayment.date, '2017-04-25');
            assert.equal(secondPayment.payIn, 200);
            assert.equal(_.sumBy(secondPayment.payments, 'cost'), 0);
            assert.equal(secondPayment.balance, 400);

            let lastPayment = report[2];
            assert.equal(lastPayment.date, '2017-05-25');
            assert.equal(lastPayment.payIn, 0);
            assert.equal(_.sumBy(lastPayment.payments, 'cost'), 400);
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

            const report = budget.buildReport(bucket, goals);

            let payOuts = _.filter(report, (r) => {
                return (r.payments && r.payments.length !== 0);
            });

            assert.lengthOf(payOuts, 5, util.inspect(payOuts, false, null));
            let firstPayments = payOuts[0].payments;
            assert.lengthOf(firstPayments, 2);
            assert.equal(firstPayments[0].name, 'Bike - MOT');
            assert.equal(firstPayments[1].name, 'Car - Maintenance');

            assert.lengthOf(payOuts[1].payments, 1);
        });

        it('Should never fail a payment', () => {
            const bucket = {category: 'Vehicles', balance: 0, createdDate: '2017-03-25', id: 0};

            let goals = [{id: 0, category: 'Vehicles', label: 'Bike - MOT', cost: 90, date: '2017-06-30'},
                {id: 1, category: 'Vehicles', label: 'Car - Maintenance', cost: 300, date: '2017-06-30'},
                {id: 2, category: 'Vehicles', label: 'AA', cost: 111, date: '2018-02-28'},
                {id: 3, category: 'Vehicles', label: 'Car - Road Tax', cost: 130, date: '2017-07-30'},
                {id: 4, category: 'Vehicles', label: 'Car - MOT', cost: 90, date: '2017-09-30'},
                {id: 5, category: 'Vehicles', label: 'Car - Insurance', cost: 565, date: '2017-10-30'}
            ];

            const report = budget.buildReport(bucket, goals);
            report.forEach((r) => {
                assert.isTrue(r.balance >= 0, util.inspect(r, false, null));
            });

        });

        it('build report will return monthly payment value', () => {
            const bucket = {category: 'Other', balance: 100, createdDate: '2017-03-25', id: 0};
            const goals = [{id: 6, category: 'Other', label: 'Phone', cost: 400, date: '2017-10-30'}];

            let report = budget.buildReport(bucket, goals);
            assert.equal(report[0].payIn, 43);
        });

        it('should not cache stuff', () => {
            const bucket = {category: 'Other', balance: 100, createdDate: '2017-03-25', id: 0};
            const goals = [{id: 6, category: 'Other', label: 'Phone', cost: 400, date: '2017-10-30'}];

            let report = budget.buildReport(bucket, goals);
            assert.equal(report[0].payIn, 43);

            report = budget.buildReport(bucket, goals);
            assert.equal(report[0].payIn, 43);
        });

        it('Ending balance should not be greater than a threshold', () => {
            const bucket = {category: 'Vehicles', balance: 0, createdDate: '2017-03-25', id: 0};

            let goals = [{id: 0, category: 'Vehicles', label: 'Bike - MOT', cost: 90, date: '2017-06-30'},
                {id: 1, category: 'Vehicles', label: 'Car - Maintenance', cost: 300, date: '2017-06-30'},
                {id: 2, category: 'Vehicles', label: 'AA', cost: 111, date: '2018-02-28'},
                {id: 3, category: 'Vehicles', label: 'Car - Road Tax', cost: 130, date: '2017-07-30'},
                {id: 4, category: 'Vehicles', label: 'Car - MOT', cost: 90, date: '2017-09-30'},
                {id: 5, category: 'Vehicles', label: 'Car - Insurance', cost: 565, date: '2017-10-30'}
            ];

            const report = budget.buildReport(bucket, goals);
            assert.isBelow(report.slice(-1)[0].balance, 5);

        });
    });
});