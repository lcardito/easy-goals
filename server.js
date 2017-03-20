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

app.get('/api/goals', (req, res) => {

});

var accounts = [];

app.get('/api/account', (req, res) => {
    //TODO get it from DB
    res.json(accounts);
});

app.post('/api/account', (req, res) => {
    //TODO store in DB


    console.log('Storing account: ' + util.inspect(req.body, false, null))
    let account = req.body;
    account.id = accounts.length;
    accounts.push(account);
    res.json(account);
})

app.put('/api/account', (req, res) => {
    //TODO store in DB
    console.log('Editing account: ' + util.inspect(req.body, false, null))
    let account = req.body;
    accounts[account.id] = account;
    res.json(account);
});

//TODO
app.delete('/api/account/:accountId', (req, res) => {
    let id = req.params.accountId;
    console.log('Deleting account with id' + id);
    accounts.splice(id, 1);
    res.json({});
});

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
