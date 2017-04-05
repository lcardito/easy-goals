const db = require('../db');
let goalApi = require('express').Router({mergeParams: true});

const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

goalApi.get('/', (req, res) => {
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

goalApi.post('/', (req, res) => {
    let goal = req.body;
    goal.user_id = req.user.id;
    goal.type = 'OUT';

    db('payment')
        .insert(goal)
        .then((savedId) => {
            db('payment')
                .where({
                    category: goal.category,
                    user_id: req.user.id
                }).select()
                .then((result) => {
                    if (result.length === 0) {
                        return db('payment').insert({
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

goalApi.put('/', (req, res) => {
    let goal = req.body;
    goal.dueDate = moment(goal.dueDate).format('YYYY-MM-DD');

    db('payment')
        .where({
            'id': goal.id,
            'user_id': req.user.id
        })
        .update(goal)
        .then(() => {
            res.json([goal]);
        });
});

goalApi.delete('/:goalId', (req, res) => {
    let id = req.params.goalId;

    db('payment')
        .where('id', '=', id)
        .del()
        .then(() => {
            res.json({});
        });
});

module.exports = goalApi;
