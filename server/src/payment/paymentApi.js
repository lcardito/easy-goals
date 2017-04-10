"use strict";

const db = require('../config/db');
const moment = require('moment');
let paymentApi = require('express').Router({mergeParams: true});

paymentApi.post('/', (req, res) => {
    let paymentIn = req.body;
    paymentIn.user_id = req.user.id;

    db('payment')
        .insert(paymentIn)
        .then((savedId) => {
            paymentIn.id = savedId;
            res.json([paymentIn]);
        });
});

paymentApi.delete('/:paymentId', (req, res) => {
    let id = req.params.paymentId;
    db('payment')
        .where({id: id})
        .del()
        .then(() => {
            res.json({});
        });
});

paymentApi.put('/', (req, res) => {
    let payment = req.body;
    payment.dueDate = moment(payment.dueDate).format('YYYY-MM-DD');

    db('payment')
        .where({
            'id': payment.id,
            'user_id': req.user.id
        })
        .update(payment)
        .then(() => {
            res.json([payment]);
        });
});

paymentApi.get('/', (req, res) => {
    if (req.query.category) {
        db('payment')
            .where({
                'user_id': req.user.id,
                'category': req.query.category
            })
            .select()
            .then((payments) => {
                res.json(payments);
            });
    } else {
        db('payment')
            .where({
                'user_id': req.user.id
            })
            .select()
            .then((payments) => {
                res.json(payments);
            });
    }
});

module.exports = paymentApi;