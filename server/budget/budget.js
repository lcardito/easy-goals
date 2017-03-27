const _ = require('lodash');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

const DATE_FORMAT = 'YYYY-MM-DD';

exports.monthlyReport = [];

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

exports.calculateMonthlySaving = function (bucket, goals) {
    let balance = bucket.balance;
    this.monthlyReport = [];

    let startSavingDate = moment(bucket.createdDate);
    let goalsByDate = _.orderBy(goals, ['date'], ['asc']);
    let monthlySaving = getInitialSavings(bucket.createdDate, goalsByDate, balance);

    for (let goalIdx = 0; goalIdx < goalsByDate.length; goalIdx++) {
        let g = goalsByDate[goalIdx];
        let nextGoalDate = moment(g.date, DATE_FORMAT);

        let monthsTillNextGoal = _.round(moment.duration(nextGoalDate.diff(startSavingDate)).asMonths());
        balance = ((monthlySaving * monthsTillNextGoal) + balance) - g.cost;

        if (balance < 0) {
            goalIdx = 0;
            monthlySaving = monthlySaving + 1;
            balance = bucket.balance;
            startSavingDate = moment(bucket.createdDate);
            continue;
        }

        startSavingDate = moment(g.date, DATE_FORMAT);
    }

    this.buildReport(bucket, goals, monthlySaving);

    return monthlySaving;
};

exports.buildReport = function (bucket, goals, monthlySaving) {
    "use strict";

    let goalsByDate = _.orderBy(goals, ['date'], ['asc']);

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

        if (goalsInMonth) {
            currentReport.payments = goalsInMonth.map((g) => {
                return {name: g.label, cost: g.cost}
            });
        }
        currentReport.date = date;
        currentReport.payIn = isLast ? 0 : monthlySaving;
        let totalPayOut = (currentReport.payments) ? _.sumBy(currentReport.payments, 'cost') : 0;

        if(!isLast) {
            bucket.balance += monthlySaving;
        }
        bucket.balance = bucket.balance - totalPayOut;
        currentReport.balance = bucket.balance;

        this.monthlyReport.push(currentReport);
    }

};