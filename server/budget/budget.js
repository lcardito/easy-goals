const _ = require('lodash');
const moment = require('moment');

const getInitialSavings = function (goals, bucket) {
    let lastDueDate = moment(goals.slice(-1)[0].date, 'YYYY-MM-DD');
    let startSavingDate = moment(bucket.createdDate, 'YYYY-MM-DD');

    let months = moment.duration(lastDueDate.diff(startSavingDate)).asMonths();

    return _.round(_.sumBy(goals, 'cost') / months);
};

exports.calculateMonthlySaving = function (bucket, goals) {
    let byDate = _.orderBy(goals, ['date'], ['asc']);

    let monthlySaving = getInitialSavings(byDate, bucket);
    let startSavingDate = moment(bucket.createdDate);
    let balance = bucket.balance;

    for (let i = 0; i < byDate.length; i++) {
        let g = byDate[i];

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