const express = require('express');
const util = require('util')
const bodyParser = require('body-parser');

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

var accounts = [];
var goals = [];

app.get('/api/account', (req, res) => {
    //TODO get it from DB
    console.log('Current accounts: ' + util.inspect(goals, false, null))
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
    console.log('Editing account: ' + util.inspect(req.body, false, null))
    let goal = req.body;
    accounts[goal.id] = goal;
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
    console.log('Deleting account with id' + id);
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
