/* eslint-disable no-undef */
function search(query, cb) {

    return fetch(`api/food?q=${query}`, {
        accept: 'application/json',
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);

}

function getMonthly(cb) {
    fetch('api/monthly/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function getGoals(cb) {
    fetch('api/goals/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function getBuckets(cb) {
    fetch('api/bucket/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function addGoal(goal, cb) {
    fetch('api/goals/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(goal)
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function addBucket(bucket, cb) {
    fetch('api/bucket/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bucket)
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function editGoal(toEdit, cb) {
    fetch('api/goals/', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(toEdit)
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function editBucket(toEdit, cb) {
    fetch('api/bucket/', {
        method: 'PUT',
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
    fetch(`api/goals/${goalId}`, {
        method: 'DELETE'
    }).then(checkStatus)
        .then(cb);
}

function deleteBucket(bucketId, cb) {
    fetch(`api/bucket/${bucketId}`, {
        method: 'DELETE'
    }).then(checkStatus)
        .then(cb);
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;

    throw error;
}

function parseJSON(response) {
    return response.json();
}

const Client = {
    search, getBuckets, addBucket, editBucket, deleteBucket,
    getGoals, addGoal, editGoal, deleteGoal, getMonthly
};

export default Client;
