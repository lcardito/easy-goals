const express = require('express');
const util = require('util');
const bodyParser = require('body-parser');
const _ = require('lodash');
const Moment = require('moment');
const MomentRange = require('moment-range');
const budget = require('./budget');

const moment = MomentRange.extendMoment(Moment);

//TODO plugin DB and migrations
// let knex = require('knex')({
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

let buckets = [
    {category: 'Other', balance: 0, createdDate: '2017-03-25', id: 0},
    {category: 'Vehicles', balance: 0, createdDate: '2017-03-25', id: 1}
];

let goals = [{id: 0, category: 'Vehicles', label: 'Bike - MOT', cost: 90, date: '2017-06-30'},
    {id: 1, category: 'Vehicles', label: 'Car - Maintanaince', cost: 300, date: '2017-06-30'},
    {id: 2, category: 'Vehicles', label: 'AA', cost: 111, date: '2018-02-28'},
    {id: 3, category: 'Vehicles', label: 'Car - Road Tax', cost: 130, date: '2017-07-30'},
    {id: 4, category: 'Vehicles', label: 'Car - MOT', cost: 90, date: '2017-09-30'},
    {id: 5, category: 'Vehicles', label: 'Car - Insurance', cost: 565, date: '2017-10-30'},
    {id: 6, category: 'Other', label: 'Phone', cost: 400, date: '2017-10-30'}
];

let payments = [
    {
        category: 'Vehicles',
        tracks: []
    },
    {
        category: 'Other',
        tracks: []
    }
];

app.get('/api/track/:trackCategory', (req, res) => {
    let cat = req.params.trackCategory;
    console.log('Getting tracks for category' + cat);

    res.json(_.find(payments, ['category', cat]).tracks);
});

app.get('/api/monthly', (req, res) => {
    console.log('Calculate monthly saving for the categories');

    let monthly = [];
    res.json(monthly);
});


app.get('/api/bucket', (req, res) => {
    //TODO get it from DB
    console.log('Get buckets: ' + buckets.length);

    const categories = [...new Set(goals.map(item => item.category))];

    categories.forEach((c) => {
        let goalsByDate = _.orderBy(goals, ['date'], ['asc']).filter((g) => g.category === c);
        let bucket = buckets.filter((a) => a.category === c)[0];
        let monthlySaving = budget.getInitialSavings(goalsByDate, bucket);

        monthlySaving = budget.calculateMonthlySaving(bucket, goalsByDate, monthlySaving);

        if (bucket) {
            bucket.monthly = monthlySaving;
        }
    });

    res.json(buckets);
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

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
