const db = require('../db');
let paymentApi = require('express').Router({mergeParams: true});

paymentApi.post('/', (req, res) => {
    let paymentIn = req.body;
    paymentIn.user_id = req.user.id;
    paymentIn.type = 'IN';

    db('payment')
        .insert(paymentIn)
        .then((savedId) => {
            paymentIn.id = savedId;
            res.json([paymentIn]);
        });
});

module.exports = paymentApi;


