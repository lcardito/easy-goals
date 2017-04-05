"use strict";

const db = require('../db');
const budget = require('../budget/report');
let bucketApi = require('express').Router({mergeParams: true});

bucketApi.get('/', (req, res) => {
    db('bucket')
        .where('user_id', req.user.id)
        .select()
        .then((buckets) => {
            db('payment')
                .where({'user_id': req.user.id})
                .select()
                .then((payments) => {
                    budget.getReport(buckets, payments).then((response) => {
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