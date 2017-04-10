"use strict";

const _ = require('lodash');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

const DATE_FORMAT = 'YYYY-MM-DD';

function calculateMonthlySavings(startingDate, goals, initialBalance) {
    let ordered = _.orderBy(goals, ['dueDate'], ['asc']);
    let totalCost = _.sumBy(goals, 'amount');
    if (initialBalance >= totalCost) {
        return 0;
    }

    let lastDueDate = moment(ordered.slice(-1)[0].dueDate, DATE_FORMAT);
    let startSavingDate = moment(startingDate, DATE_FORMAT);

    let months = Math.floor(moment.duration(lastDueDate.diff(startSavingDate)).asMonths());
    return Math.ceil((totalCost - initialBalance) / months);
}

exports.buildReport = (bucket, paymentsOut, paymentsIn) => {
    paymentsIn = paymentsIn ? paymentsIn : [];
    let startingBalance = bucket.balance;
    let paymentsOutByDate = _.orderBy(paymentsOut, ['dueDate'], ['asc']);
    let maxPayment = _.maxBy(paymentsOut, 'amount');

    let monthlySaving = calculateMonthlySavings(bucket.createdDate, paymentsOutByDate, startingBalance);

    let report = [];
    let monthsIn = Array.from(moment.range(moment(bucket.createdDate),
        moment(paymentsOutByDate.slice(-1)[0].dueDate, DATE_FORMAT)).by('month'));

    for (let mIdx = 1; mIdx <= monthsIn.length; mIdx++) {
        let currentMonth = monthsIn[mIdx - 1];
        let isLast = mIdx === monthsIn.length;

        let currentMonthPaymentIn = paymentsIn.filter((p) => {
            return moment(p.dueDate).isSame(currentMonth, 'month')
                && moment(p.dueDate).isSame(currentMonth, 'year');
        });

        let reportItem = {
            dueDate: currentMonth.format(DATE_FORMAT),
            payIn: isLast ? 0 : monthlySaving
        };

        let tempBalance = startingBalance + reportItem.payIn + _.sumBy(currentMonthPaymentIn, 'amount');
        let currentMothPaymentsOut = paymentsOut.filter((g) => {
            return moment(g.dueDate).isSame(currentMonth, 'month')
                && moment(g.dueDate).isSame(currentMonth, 'year')
        });
        if (currentMothPaymentsOut.length > 0) {
            tempBalance = tempBalance - _.sumBy(currentMothPaymentsOut, 'amount');

            if (tempBalance < 0) {
                mIdx = 0;
                monthlySaving += 1;
                report = [];
                startingBalance = bucket.balance;
                continue;
            }

            if (currentMothPaymentsOut.indexOf(maxPayment) !== -1) {
                let nextGoals = paymentsOut.filter((g) => {
                    return moment(g.dueDate).isAfter(currentMonth, 'month');
                });
                let newMonthly = calculateMonthlySavings(currentMonth.clone().add(1, 'month'), nextGoals, tempBalance);
                if (newMonthly < monthlySaving) {
                    monthlySaving = newMonthly;
                }
            }
        }

        startingBalance = tempBalance;
        reportItem.balance = tempBalance;
        reportItem.payments = currentMothPaymentsOut.concat(currentMonthPaymentIn);

        report.push(reportItem);
    }

    return report;
};

exports.getReport = (buckets, payments) => {
    return new Promise((fulfill, reject) => {
        let response = [];
        let now = moment();

        buckets.forEach((b) => {
            let category = b.category;
            let paymentsOut = payments.filter((g) => g.category === category && g.type === 'OUT');
            let paymentsIn = payments.filter((p) => p.category === category && p.type === 'IN');
            let report = [];
            if(paymentsOut.length > 0) {
                try {
                    report = this.buildReport(b, paymentsOut, paymentsIn);
                } catch (e) {
                    reject();
                }
            }
            const current = _.find(report, (r) => {
                return moment(r.date).isSame(now, 'month')
                    && moment(r.date).isSame(now, 'year');
            });

            b.report = report;
            b.balance = current ? current.balance : 0;
            b.monthly = current ? current.payIn : 0;

            response.push(b);
        });

        fulfill(response);
    });
};