const _ = require('lodash');
const moment = require('moment');

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

exports.calculateMonthlySaving = function (bucket, goals) {
    let balance = bucket.balance;

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
        startSavingDate = moment(g.date, DATE_FORMAT);
    }
    return monthlySaving;
};