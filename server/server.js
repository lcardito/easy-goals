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
        knex('user').where({email: username})
            .limit(1)
            .select()
            .then((result) => {
                let user = result[0];
                if(!user) {
                    return done(null, false);
                }
                passwUtil.comparePassword(password, user.password, (err, isValid) => {
                   if(isValid) {
                       return done(null, user);
                   } else {
                       return done(null, false);
                   }
                });
            });
    }
));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    knex('user').where({id: id}).then((user) => {
        cb(null, user);
    });
});


const app = express();
app.set('port', (process.env.PORT || 3001));

app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(passport.initialize());
app.use(passport.session());


// Express only serves static assets in production
if (env === 'production') {
    app.use(express.static('client/build'));
}

app.get('/api/bucket', (req, res) => {
    knex('bucket').select().then((buckets) => {
        "use strict";
        knex('goal').select().then((goals) => {

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
    });
});

app.get('/api/goals', (req, res) => {
    knex('goal').select().then((goals) => {
        "use strict";

        res.json(goals);
    });
});

app.post('/api/goals', (req, res) => {
    let goal = req.body;

    knex('goal').insert(goal).then((savedId) => {
        "use strict";

        knex('bucket').where({category: goal.category}).select().then((result) => {
            if (result.length === 0) {
                return knex('bucket').insert({
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

app.put('/api/goals', (req, res) => {
    let goal = req.body;

    knex('goal')
        .where('id', '=', goal.id)
        .update(goal).then(() => {
        "use strict";

        res.json([goal]);
    });

});

app.delete('/api/goals/:goalId', (req, res) => {
    let id = req.params.goalId;

    knex('goal')
        .where('id', '=', id)
        .del().then(() => {
        "use strict";

        res.json({});
    });
});

app.post('/login',
    passport.authenticate('local', {failWithError: true}),
    (req, res) => {
        return res.json(req.user);
    },
    (err, req, res, next) => {
        return res.json(err);
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
