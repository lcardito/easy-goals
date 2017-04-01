"use strict";

const _ = require('lodash');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

const DATE_FORMAT = 'YYYY-MM-DD';
const BALANCE_THRESHOLD = 5;

function calculateMonthlySavings(startingDate, goals, initialBalance) {
    let totalCost = _.sumBy(goals, 'cost');
    if (initialBalance >= totalCost) {
        return 0;
    }

    let lastDueDate = moment(goals.slice(-1)[0].dueDate, DATE_FORMAT);
    let startSavingDate = moment(startingDate, DATE_FORMAT);

    let months = Math.floor(moment.duration(lastDueDate.diff(startSavingDate)).asMonths());
    return Math.ceil((totalCost - initialBalance) / months);
}

exports.buildReport = (bucket, goals) => {
    let startingBalance = bucket.balance;
    let goalsByDate = _.orderBy(goals, ['dueDate'], ['asc']);
    let monthlySaving = calculateMonthlySavings(bucket.createdDate, goalsByDate, startingBalance);

    let report = [];
    let monthsIn = Array.from(moment.range(moment(bucket.createdDate),
        moment(goalsByDate.slice(-1)[0].dueDate, DATE_FORMAT)).by('month'));

    for (let mIdx = 1; mIdx <= monthsIn.length; mIdx++) {
        let currentMonth = monthsIn[mIdx - 1];
        let isLast = mIdx === monthsIn.length;

        let current = {
            dueDate: currentMonth.format(DATE_FORMAT),
            payIn: isLast ? 0 : monthlySaving
        };
        let payments = [];

        let goalsInMonth = goals.filter((g) => {
            return moment(g.dueDate).isSame(currentMonth, 'month')
                && moment(g.dueDate).isSame(currentMonth, 'year')
        });

        let tempBalance = startingBalance + current.payIn;
        if (goalsInMonth.length > 0) {
            payments = goalsInMonth.map((g) => {
                return {name: g.label, cost: g.cost}
            });

            tempBalance = tempBalance - _.sumBy(payments, 'cost');

            if (tempBalance < 0) {
                mIdx = 0;
                monthlySaving += 1;
                report = [];
                startingBalance = bucket.balance;
                continue;
            }
        }

        if (tempBalance < BALANCE_THRESHOLD) {
            let nextGoals = goals.filter((g) => {
                return moment(g.dueDate).isAfter(currentMonth, 'month');
            });
            monthlySaving = calculateMonthlySavings(currentMonth.add(1, 'month'), nextGoals, tempBalance);
        }

        startingBalance = tempBalance;
        current.balance = tempBalance;
        current.payments = payments;

        report.push(current);
    }

    return report;
};