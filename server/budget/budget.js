const _ = require('lodash');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

const DATE_FORMAT = 'YYYY-MM-DD';

function calculateMonthlySavings(startingDate, goals, initialBalance) {
    let totalCost = _.sumBy(goals, 'cost');
    if (initialBalance >= totalCost) {
        return 0;
    }

    let lastDueDate = moment(goals.slice(-1)[0].date, DATE_FORMAT);
    let startSavingDate = moment(startingDate, DATE_FORMAT);

    let months = Math.floor(moment.duration(lastDueDate.diff(startSavingDate)).asMonths());
    return Math.ceil((totalCost - initialBalance) / months);
}

exports.buildReport = function (bucket, goals) {
    "use strict";

    let startingBalance = bucket.balance;
    let monthlySaving = calculateMonthlySavings(bucket.createdDate, goals, startingBalance);
    let goalsByDate = _.orderBy(goals, ['date'], ['asc']);

    let report = [];
    let monthsIn = Array.from(moment.range(moment(bucket.createdDate), moment(goalsByDate.slice(-1)[0].date, DATE_FORMAT)).by('month'));
    for (let mIdx = 1; mIdx <= monthsIn.length; mIdx++) {
        let currentMonth = monthsIn[mIdx - 1];
        let isLast = mIdx === monthsIn.length;

        let current = {
            date: currentMonth.format(DATE_FORMAT),
            payIn: isLast ? 0 : monthlySaving
        };

        let goalsInMonth = goals.filter((g) => {
            return moment(g.date).isSame(currentMonth, 'month')
                && moment(g.date).isSame(currentMonth, 'year')
        });

        let tempBalance = startingBalance + current.payIn;
        if (goalsInMonth) {
            current.payments = goalsInMonth.map((g) => {
                return {name: g.label, cost: g.cost}
            });

            tempBalance = tempBalance - _.sumBy(current.payments, 'cost');

            if (tempBalance < 0) {
                mIdx = 0;
                continue;
            }

            let nextGoals = goals.filter((g) => {
                return moment(g.date).isAfter(currentMonth, 'month');
            });
            monthlySaving = calculateMonthlySavings(currentMonth.add(1, 'month'), nextGoals, tempBalance);
        }
        startingBalance = tempBalance;
        current.balance = tempBalance;

        report.push(current);
    }

    return report;
};