const _ = require('lodash');
const Moment = require('moment');
const MomentRange = require('moment-range');
var util = require("util");
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

    for (let i = 0; i < goalsByDate.length; i++) {
        let g = goalsByDate[i];
        let nextGoalDate = moment(g.date, DATE_FORMAT);

        let monthsTillNextGoal = _.round(moment.duration(nextGoalDate.diff(startSavingDate)).asMonths());
        balance = ((monthlySaving * monthsTillNextGoal) + balance) - g.cost;

        if (balance < 0) {
            i = 0;
            monthlySaving = monthlySaving + 1;
            balance = bucket.balance;
            startSavingDate = moment(bucket.createdDate);
            continue;
        }

        let range = moment.range(startSavingDate, nextGoalDate);
        let j = 1;
        for (let month of range.by('month')) {
            let date = month.format(DATE_FORMAT);

            let currentReport = {};
            currentReport.date = date;
            currentReport.payIn = monthlySaving;
            currentReport.payOut = (month.isSame(g.date, 'month')) ? g.cost : 0;
            currentReport.balance = (j * monthlySaving) - currentReport.payOut;
            j++;

            let currentIdx = _.findIndex(this.monthlyReport, ['date', date]);
            if (currentIdx !== -1) {
                this.monthlyReport.splice(currentIdx, 1, currentReport);
            } else {
                this.monthlyReport.push(currentReport);
            }
        }

        startSavingDate = moment(g.date, DATE_FORMAT);
    }

    return monthlySaving;
};