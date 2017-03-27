const _ = require('lodash');
const Moment = require('moment');
const MomentRange = require('moment-range');
var util = require("util");
const moment = MomentRange.extendMoment(Moment);

const DATE_FORMAT = 'YYYY-MM-DD';

function getInitialSavings(startingDate, goals, initialBalance) {
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

    let monthlySaving = getInitialSavings(bucket.createdDate, goals, bucket.balance);
    let goalsByDate = _.orderBy(goals, ['date'], ['asc']);
    let report = [];

    let monthsIn = Array.from(moment.range(moment(bucket.createdDate), moment(goalsByDate.slice(-1)[0].date, DATE_FORMAT)).by('month'));
    for (let mIdx = 1; mIdx <= monthsIn.length; mIdx++) {
        let month = monthsIn[mIdx - 1];
        let isLast = mIdx === monthsIn.length;

        let currentReport = {};

        let date = month.format(DATE_FORMAT);

        let goalsInMonth = _.filter(goals, (g) => {
            return moment(g.date).isSame(month, 'month')
                && moment(g.date).isSame(month, 'year')
        });

        currentReport.date = date;
        currentReport.payIn = isLast ? 0 : monthlySaving;

        let tempBalance = bucket.balance + currentReport.payIn;
        if (goalsInMonth) {
            currentReport.payments = goalsInMonth.map((g) => {
                return {name: g.label, cost: g.cost}
            });

            tempBalance = tempBalance - _.sumBy(currentReport.payments, 'cost');

            if (tempBalance < 0) {
                mIdx = 0;
                continue;
            }

            let nextGoals = goals.filter((g) => {
                return moment(g.date).isAfter(moment(date), 'month');
            });
            monthlySaving = getInitialSavings(moment(date).add(1, 'month'), nextGoals, tempBalance);
        }
        bucket.balance = tempBalance;
        currentReport.balance = bucket.balance;

        report.push(currentReport);
    }

    return report;
};