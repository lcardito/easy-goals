"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const auth = require('./config/authtMiddleware');
const cors = require('cors');

const env = process.env.NODE_ENV;
console.log('Starting server in ' + env);

const db = require('./config/db');

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

// Express only serves static assets in production
if (env === 'production') {
    app.use(express.static('../client/build'));
}

if (env === 'production' || env === 'docker') {
    let whitelist = ['http://localhost:3000', 'https://simple-goals.herokuapp.com'];
    let corsOptionsDelegate = (req, callback) => {
        let corsOptions;
        if (whitelist.indexOf(req.header('Origin')) !== -1) {
            corsOptions = {
                origin: true,
                credentials: true
            };
        } else {
            corsOptions = {origin: false}
        }
        callback(null, corsOptions);
    };

    app.use(cors(corsOptionsDelegate));
}
app.use(auth.initialize());
app.use(auth.session());

app.post('/login',
    auth.authenticate('local', {failWithError: true}),
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

api.use('/bucket', require('./bucket/bucketApi'));
api.use('/payment', require('./payment/paymentApi'));
api.use('/goals', require('./payment/goalApi'));

app.use('/api', api);

console.log('Running database migrations');
db.migrate.latest()
    .then(() => {
        if (env === 'test') {
            return db.seed.run();
        }
    }).then(() => {
    app.listen(process.env.PORT || app.get('port'), () => {
        console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
    });
    app.emit('ready', null);
    app.isRunning = true;
});


module.exports = {
    app: app,
    knex: db
};
