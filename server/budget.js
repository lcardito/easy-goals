const _ = require('lodash');
const moment = require('moment');

exports.getInitialSavings = function (goalsByDate, bucket) {
    let lastDueDate = goalsByDate.slice(-1)[0].date;
    lastDueDate = moment(lastDueDate, 'YYYY-MM-DD');

    let startSavingDate = moment(bucket.createdDate, 'YYYY-MM-DD');
    let duration = moment.duration(lastDueDate.diff(startSavingDate));
    let months = duration.asMonths();

    return _.round(_.sumBy(goalsByDate, 'cost') / months);
};

exports.calculateMonthlySaving = function (bucket, goals, monthlySaving) {
    let startSavingDate = moment(bucket.createdDate);
    let balance = bucket.balance;

    for (let i = 0; i < goals.length; i++) {
        let g = goals[i];

        let nextGoalDate = moment(g.date, 'YYYY-MM-DD');
        let monthsTillNextGoal = _.round(moment.duration(nextGoalDate.diff(startSavingDate)).asMonths());
        balance = ((monthlySaving * monthsTillNextGoal) + balance) - g.cost;

        if (balance <= 0) {
            i = 0;
            monthlySaving = monthlySaving + 1;
            balance = bucket.balance;
            startSavingDate = moment(bucket.createdDate);
            continue;
        }
        startSavingDate = moment(g.date, 'YYYY-MM-DD');
    }
    return monthlySaving;
};