"use strict";

const db = require('./db');

const auth = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const passwUtil = require('./passwUtil');

auth.use(new LocalStrategy({
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
            }).catch((e) => {
            "use strict";
            console.error('Something went wrong ' + e);
        });
    }
));

auth.serializeUser((user, cb) => {
    cb(null, user.id);
});

auth.deserializeUser((id, cb) => {
    db('user')
        .where({id: id})
        .select('id', 'username', 'email', 'createdDate')
        .then((result) => {
            cb(null, result[0]);
        });
});

module.exports = auth;
