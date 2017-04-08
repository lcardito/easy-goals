"use strict";

let payments = [
    {
        "id": 28,
        "user_id": 99,
        "category": "Personal",
        "label": "Personal Goal 1",
        "amount": 90,
        "dueDate": "2017-06-29",
        "type": "OUT"
    },
    {
        "id": 29,
        "user_id": 99,
        "category": "Personal",
        "label": "Personal Goal 2",
        "amount": 300,
        "dueDate": "2017-06-29",
        "type": "OUT"
    },
    {
        "id": 30,
        "user_id": 99,
        "category": "Personal",
        "label": "Personal Goal 3",
        "amount": 111,
        "dueDate": "2018-02-28",
        "type": "OUT"
    },
    {
        "id": 31,
        "user_id": 99,
        "category": "Personal",
        "label": "Personal Goal 4",
        "amount": 130,
        "dueDate": "2017-07-29",
        "type": "OUT"
    },
    {
        "id": 32,
        "user_id": 99,
        "category": "Personal",
        "label": "Personal Goal 5",
        "amount": 90,
        "dueDate": "2017-09-29",
        "type": "OUT"
    },
    {
        "id": 33,
        "user_id": 99,
        "category": "Personal",
        "label": "Personal Goal 6",
        "amount": 565,
        "dueDate": "2017-10-30",
        "type": "OUT"
    },
    {
        "id": 34,
        "user_id": 99,
        "category": "Home",
        "label": "Home Goal 1",
        "amount": 110,
        "dueDate": "2017-07-29",
        "type": "OUT"
    },
    {
        "id": 35,
        "user_id": 99,
        "category": "Home",
        "label": "Home Goal 2",
        "amount": 210,
        "dueDate": "2017-09-29",
        "type": "OUT"
    },
    {
        "id": 36,
        "user_id": 99,
        "category": "Home",
        "label": "Home Goal 3",
        "amount": 60,
        "dueDate": "2017-10-30",
        "type": "OUT"
    },
    {
        "id": 49,
        "user_id": 99,
        "category": "Personal",
        "label": "Personal cash 1",
        "amount": 100,
        "dueDate": "2017-04-05",
        "type": "IN"
    },
    {
        "id": 50,
        "user_id": 99,
        "category": "Personal",
        "label": "Personal Goal 7",
        "amount": 100,
        "dueDate": "2017-04-05",
        "type": "OUT"
    }
];

let bucket = {id: 12, user_id: 99, category: 'Personal', balance: 0, createdDate: '2017-03-25T00:00:00.000Z'};

module.exports = {
    payments: payments,
    bucket: bucket
};


