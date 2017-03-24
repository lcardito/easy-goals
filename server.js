const express = require('express');
const util = require('util')
const bodyParser = require('body-parser');
var _ = require('lodash');
var moment = require('moment')

//TODO plugin DB and migrations
// var knex = require('knex')({
//     client: 'mysql2',
//     connection: {
//         host: 'db',
//         user: 'goals',
//         password: 'pwd',
//         database: 'goals'
//     }
// });
//
// knex.migrate.latest()
//     .then(function () {
//         console.log('DB migrated');
//     });

const app = express();
app.set('port', (process.env.PORT || 3001));
app.use(bodyParser.json());

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

var accounts = [
    { name: 'HSBC', category: 'Other', balance: '100', id: 0 },
    { name: 'HSBC', category: 'Vechicles', balance: '1000', id: 1 }
];
var goals = [
    {id: 0, category: 'Vechicles', label: 'Bike - MOT', cost: 90, date: '2017-06-30'},
    {id: 1, category: 'Vechicles', label: 'Car - Maintanaince', cost: 300, date: '2017-06-30'},
    {id: 2, category: 'Vechicles', label: 'AA', cost: 111, date: '2018-02-28'},
    {id: 3, category: 'Vechicles', label: 'Car - Road Tax', cost: 130, date: '2017-07-30'},
    {id: 4, category: 'Vechicles', label: 'Car - MOT', cost: 90, date: '2017-09-30'},
    {id: 5, category: 'Vechicles', label: 'Car - Insurance', cost: 565, date: '2017-10-30'},
    {id: 6, category: 'Other', label: 'Phone', cost: 400, date: '2017-10-30'}
];

function calculateBalance(goals, monthlySaving) {
    var someDate = moment();
    var balance = 0;
    goals.some((g) => {
        var end = moment(g.date, 'YYYY-MM-DD');
        var monthsTillNextGoal = _.round(moment.duration(end.diff(someDate)).asMonths());
        balance = (monthlySaving * monthsTillNextGoal) + balance - g.cost;

        someDate = moment(g.date, 'YYYY-MM-DD');
        if (balance <= 0) {
            return balance;
        }
    });

    return _.round(balance);
}

app.get('/api/monthly', (req, res) => {
    console.log('Calculate monthly saving for the categories');

    var monthly = [];
    const categories = [...new Set(goals.map(item => item.category))];

    categories.forEach((c) => {
        var orderByDate = _.orderBy(goals, ['date'], ['asc']).filter((g) => g.category === c);

        var lastDueDate = orderByDate.slice(-1)[0].date;
        var today = moment();
        var end = moment(lastDueDate, 'YYYY-MM-DD');
        var duration = moment.duration(end.diff(today));
        var months = duration.asMonths();

        var monthlySaving = _.round(_.sumBy(orderByDate, 'cost') / months);

        var balance = 0;
        while (balance <= 0) {
            balance = calculateBalance(orderByDate, monthlySaving);
            monthlySaving = monthlySaving + 1;
        }

        var accountBalance = accounts.filter((a) => a.category === c)[0].balance;
        monthly.push({category: c, balance: accountBalance, monthly: monthlySaving});
    });

    res.json(monthly);
})

app.get('/api/account', (req, res) => {
    //TODO get it from DB
    console.log('Current accounts: ' + util.inspect(accounts, false, null))
    res.json(accounts);
});

app.get('/api/goals', (req, res) => {
    //TODO get it from DB
    console.log('Current goals: ' + util.inspect(goals, false, null))
    res.json(goals);
});

app.post('/api/goals', (req, res) => {
    //TODO store in DB
    console.log('Storing account: ' + util.inspect(req.body, false, null))
    let goal = req.body;
    goal.id = goals.length;
    goals.push(goal);
    console.log('Returnig json ' + util.inspect(goal, false, null));
    res.json(goal);
})

app.post('/api/account', (req, res) => {
    //TODO store in DB
    console.log('Storing account: ' + util.inspect(req.body, false, null))
    let account = req.body;
    account.id = accounts.length;
    accounts.push(account);
    res.json(account);
})

app.put('/api/goals', (req, res) => {
    //TODO store in DB
    console.log('Editing goal: ' + util.inspect(req.body, false, null))
    let goal = req.body;
    goals[goal.id] = goal;
    res.json(goal);
});


app.put('/api/account', (req, res) => {
    //TODO store in DB
    console.log('Editing account: ' + util.inspect(req.body, false, null))
    let account = req.body;
    accounts[account.id] = account;
    res.json(account);
});

app.delete('/api/goals/:goalId', (req, res) => {
    let id = req.params.goalId;
    console.log('Deleting goal with id' + id);
    goals.splice(id, 1);
    res.json({});
});

app.delete('/api/account/:accountId', (req, res) => {
    let id = req.params.accountId;
    console.log('Deleting account with id' + id);
    accounts.splice(id, 1);
    res.json({});
});

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
