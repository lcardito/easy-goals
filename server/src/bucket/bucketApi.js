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

bucketApi.put('/', (req, res) => {
    let bucket = req.body;
    let toUpdate = {
        color: bucket.color
    };

    db('bucket')
        .where({
            'id': bucket.id,
            'user_id': req.user.id
        })
        .update(toUpdate)
        .then(() => {
            res.json([bucket]);
        });
});

module.exports = bucketApi;