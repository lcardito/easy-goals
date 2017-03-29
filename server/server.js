const express = require('express');
const bodyParser = require('body-parser');

const util = require('util');
const _ = require('lodash');
const Moment = require('moment');
const MomentRange = require('moment-range');
const budget = require('./budget/budget');
const moment = MomentRange.extendMoment(Moment);

let env = process.env.NODE_ENV;
console.log('Starting server in ' + env);

const config = require('../knexfile');
console.log('Knex config: ' + util.inspect(config[env], false, null));
const knex = require('knex')(config[env]);

const app = express();
app.set('port', (process.env.PORT || 3001));
app.use(bodyParser.json());

// Express only serves static assets in production
if (env === 'production') {
    app.use(express.static('client/build'));
}

const buckets = [
    {category: 'Other', balance: 0, createdDate: '2017-03-25', id: 0},
    {category: 'Vehicles', balance: 0, createdDate: '2017-03-25', id: 1}
];

const goals = [{id: 0, category: 'Vehicles', label: 'Bike - MOT', cost: 90, date: '2017-06-30'},
    {id: 1, category: 'Vehicles', label: 'Car - Maintenance', cost: 300, date: '2017-06-30'},
    {id: 2, category: 'Vehicles', label: 'AA', cost: 111, date: '2018-02-28'},
    {id: 3, category: 'Vehicles', label: 'Car - Road Tax', cost: 130, date: '2017-07-30'},
    {id: 4, category: 'Vehicles', label: 'Car - MOT', cost: 90, date: '2017-09-30'},
    {id: 5, category: 'Vehicles', label: 'Car - Insurance', cost: 565, date: '2017-10-30'},
    {id: 6, category: 'Other', label: 'Phone', cost: 400, date: '2017-10-30'}
];

app.get('/api/bucket', (req, res) => {
    //TODO get it from DB
    console.log('Get buckets: ' + buckets.length);

    const categories = [...new Set(goals.map(item => item.category))];
    let now = moment();
    let response = [];

    categories.forEach((c) => {
        let goalsForCategory = goals.filter((g) => g.category === c);
        let bucket = buckets.filter((a) => a.category === c)[0];

        if (bucket) {
            let responseBucket = util._extend({}, bucket);
            const report = budget.buildReport(responseBucket, goalsForCategory);
            const current = _.find(report, (r) => {
                return moment(r.date).isSame(now, 'month')
                    && moment(r.date).isSame(now, 'year');
            });

            responseBucket.report = report;
            responseBucket.balance = current.balance;
            responseBucket.monthly = current.payIn;
            response.push(responseBucket);
        }
    });
    res.json(response);
});

app.get('/api/goals', (req, res) => {
    //TODO get it from DB
    console.log('Getting goals: ' + goals.length);
    res.json(goals);
});

app.post('/api/goals', (req, res) => {
    //TODO store in DB
    console.log('Storing bucket: ' + util.inspect(req.body, false, null));
    let goal = req.body;
    goal.id = goals.length;
    goals.push(goal);
    console.log('Returnig json ' + util.inspect(goal, false, null));
    res.json(goal);
});

app.post('/api/bucket', (req, res) => {
    //TODO store in DB
    console.log('Storing bucket: ' + util.inspect(req.body, false, null));
    let bucket = req.body;
    bucket.id = buckets.length;
    buckets.push(bucket);
    res.json(bucket);
});

app.put('/api/goals', (req, res) => {
    //TODO store in DB
    console.log('Editing goal: ' + util.inspect(req.body, false, null));
    let goal = req.body;
    goals[goal.id] = goal;
    res.json(goal);
});


app.put('/api/bucket', (req, res) => {
    //TODO store in DB
    console.log('Editing bucket: ' + util.inspect(req.body, false, null));
    let bucket = req.body;
    buckets[bucket.id] = bucket;
    res.json(bucket);
});

app.delete('/api/goals/:goalId', (req, res) => {
    let id = req.params.goalId;
    console.log('Deleting goal with id' + id);
    goals.splice(id, 1);
    res.json({});
});

app.delete('/api/bucket/:bucketId', (req, res) => {
    let id = req.params.bucketId;
    console.log('Deleting bucket with id' + id);
    buckets.splice(id, 1);
    res.json({});
});

knex.migrate.latest()
    .then(() => {
        console.log('DB migrated. Running seeds');
        return knex.seed.run();
    })
    .then(() => {
        app.listen(app.get('port'), () => {

            console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console

            app.emit('ready', null);

        });
    });

module.exports = {
    app: app,
    knex: knex
};
