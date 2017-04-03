"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

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
const db = require('knex')(config[env]);

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const passwUtil = require('./passwUtil');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false,
        session: true
    },
    (username, password, done) => {
        db('user').where({email: username})
            .limit(1)
            .select()
            .then((result) => {
                let user = result[0];
                if (!user) {
                    return done(null, false);
                }
                passwUtil.comparePassword(password, user.password, (err, isValid) => {
                    if (isValid) {
                        delete user["password"];
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                });
            });
    }
));

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    db('user')
        .where({id: id})
        .select('id', 'username', 'email', 'createdDate')
        .then((result) => {
            cb(null, result[0]);
        });
});


const app = express();
app.set('port', (process.env.PORT || 3001));

app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());
app.use(['/*'], session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: false
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Express only serves static assets in production
if (env === 'production') {
    app.use(express.static('client/build'));
}

app.post('/login',
    passport.authenticate('local', {failWithError: true}),
    (req, res) => {
        return res.json(req.user);
    });

let api = express.Router();

api.use((req, res, next) => {
    if (req.user) {
        res.cookie('goals.user', JSON.stringify(req.user), {maxAge: 900000, httpOnly: false});
        next();
    } else {
        return res.status(403).send({
            success: false,
            message: 'User is not authenticated'
        });
    }
});

api.get('/bucket', (req, res) => {
    db('bucket')
        .where('user_id', req.user.id)
        .select()
        .then((buckets) => {
            db('payment')
                .where({
                    'user_id': req.user.id
                })
                .select()
                .then((payments) => {
                    let response = [];
                    let now = moment();

                    buckets.forEach((b) => {
                        let category = b.category;
                        let goalsForCategory = payments.filter((g) => g.category === category && g.type === 'OUT');
                        const report = budget.buildReport(b, goalsForCategory);

                        const current = _.find(report, (r) => {
                            return moment(r.date).isSame(now, 'month')
                                && moment(r.date).isSame(now, 'year');
                        });

                        b.report = report;
                        b.balance = current.balance;
                        b.monthly = current.payIn;
                        response.push(b);

                    });
                    res.json(response);
                });
        });
});

api.put('/bucket/:bucketId', (req, res) => {
    let id = req.params.bucketId;
    // let lumpSumPayment = req.body.

});

api.get('/goals', (req, res) => {
    db('payment')
        .where({
            'user_id': req.user.id,
            'type': 'OUT'
        })
        .select()
        .then((goals) => {
            res.json(goals);
        });
});

api.post('/goals', (req, res) => {
    let goal = req.body;
    goal.user_id = req.user.id;
    db('payment')
        .insert(goal)
        .then((savedId) => {
            db('bucket')
                .where({
                    category: goal.category,
                    user_id: req.user.id
                }).select()
                .then((result) => {
                    if (result.length === 0) {
                        return db('bucket').insert({
                            user_id: req.user.id,
                            category: goal.category,
                            balance: 0,
                            createdDate: moment().format('YYYY-MM-DD')
                        })
                    }
                }).then(() => {
                goal.id = savedId;
                res.json([goal]);
            });
        });
});

api.put('/goals', (req, res) => {
    let goal = req.body;

    db('payment')
        .where('id', '=', goal.id)
        .update(goal)
        .then(() => {
            res.json([goal]);
        });
});

api.delete('/goals/:goalId', (req, res) => {
    let id = req.params.goalId;

    db('payment')
        .where('id', '=', id)
        .del()
        .then(() => {
            res.json({});
        });
});

app.use('/api', api);

db.migrate.latest()
    .then(() => {
        app.listen(process.env.PORT || app.get('port'), () => {
            console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
            app.emit('ready', null);
            app.isRunning = true;
        });
    });


module.exports = {
    app: app,
    knex: db
};
