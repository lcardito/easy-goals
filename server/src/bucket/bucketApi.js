"use strict";

const db = require('../config/db');
const reporter = require('../report/report');
const bucketApi = require('express').Router({mergeParams: true});

bucketApi.get('/', (req, res) => {
    db('bucket')
        .where('user_id', req.user.id)
        .select()
        .then((buckets) => {
            db('payment')
                .where({'user_id': req.user.id})
                .select()
                .then((payments) => {
                    reporter.getReport(buckets, payments).then((response) => {
                        res.json(response);
                    });
                });
        });
});

bucketApi.get('/:bucketId', (req, res) => {
    db('bucket')
        .where({
            'user_id': req.user.id,
            'id': req.params.bucketId
        })
        .select()
        .then((buckets) => {
            res.json(buckets[0]);
        });
});


module.exports = bucketApi;