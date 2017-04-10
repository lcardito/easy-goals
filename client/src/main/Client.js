const BASE = process.env.NODE_ENV === 'production' ? 'https://simple-goals.herokuapp.com' : 'http://localhost:3001';

/* eslint-disable no-undef */
function search(query, cb) {
    return fetch(`${BASE}/api/food?q=${query}`, {
        accept: 'application/json',
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);

}

function login(user, cb) {
    fetch(`${BASE}/login`, {
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
    fetch(`${BASE}/api/goals/`, {
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
    fetch(`${BASE}/api/bucket/`, {
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
    fetch(`${BASE}/api/bucket/${bucketId}`, {
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
    fetch(`${BASE}/api/bucket`, {
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

function addGoal(goal, cb) {
    fetch(`${BASE}/api/goals/`, {
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
    fetch(`${BASE}/api/payment/`, {
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
    fetch(`${BASE}/api/goals/`, {
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
    fetch(`${BASE}/api/goals/${goalId}`, {
        method: 'DELETE',
        credentials: 'include'
    }).then(checkStatus)
        .then(cb);
}

function deletePayment(paymentId, cb) {
    fetch(`${BASE}/api/payment/${paymentId}`, {
        method: 'DELETE',
        credentials: 'include'
    }).then(checkStatus)
        .then(cb);
}


function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(`${BASE}/HTTP Error ${response.statusText}`);
    error.errorStatus = response.statusText;
    error.response = response;

    throw error;
}

function parseJSON(response) {
    return response.json();
}

const Client = {
    search, getBuckets, getGoals, addGoal, editGoal, deleteGoal, login, getBucket, addPayment, deletePayment, updateBucket
};

export default Client;
