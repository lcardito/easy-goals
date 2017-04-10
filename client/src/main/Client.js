
/* eslint-disable no-undef */
function login(user, cb) {
    fetch(`/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb)
        .catch(cb);
}

function getGoals(cb) {
    fetch(`/api/goals/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function getBuckets(cb) {
    fetch(`/api/bucket/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function getBucket(bucketId, cb) {
    fetch(`/api/bucket/${bucketId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function updateBucket(bucket, cb) {
    fetch(`/api/bucket`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bucket)
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function addBucket(bucket, cb) {
    fetch(`/api/bucket`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bucket)
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function addGoal(goal, cb) {
    fetch(`/api/goals/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(goal)
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function addPayment(payment, cb) {
    fetch(`/api/payment/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payment)
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function editGoal(toEdit, cb) {
    fetch(`/api/goals/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(toEdit)
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function deleteGoal(goalId, cb) {
    fetch(`/api/goals/${goalId}`, {
        method: 'DELETE',
        credentials: 'include'
    }).then(checkStatus)
        .then(cb);
}

function deletePayment(paymentId, cb) {
    fetch(`/api/payment/${paymentId}`, {
        method: 'DELETE',
        credentials: 'include'
    }).then(checkStatus)
        .then(cb);
}


function getPayments(category, cb) {
    fetch(`/api/payment?category=${category}`, {
        method: 'GET',
        credentials: 'include'
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function updatePayment(toEdit, cb) {
    fetch(`/api/payment/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(toEdit)
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.errorStatus = response.statusText;
    error.response = response;

    throw error;
}

function parseJSON(response) {
    return response.json();
}

const Client = {
    login: login,
    bucket: {
        all: getBuckets,
        one: getBucket,
        edit: updateBucket,
        save: addBucket
    },
    goal: {
        all: getGoals,
        edit: editGoal,
        remove: deleteGoal,
        save: addGoal
    },
    payment: {
        save: addPayment,
        remove: deletePayment,
        all: getPayments,
        edit: updatePayment
    }
};

export default Client;
