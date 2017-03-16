const express = require('express');
var bodyParser = require('body-parser');

var knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: 'db',
        user: 'goals',
        password: 'pwd',
        database: 'goals'
    }
});

knex.migrate.latest()
    .then(function () {
        console.log('DB migrated');
    });

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
    console.log('Storing account: ' + req.body.name)
    accounts.push(req.body);
    res.send('OK');
})

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
