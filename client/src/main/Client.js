/* eslint-disable no-undef */
function search(query, cb) {
    return fetch(`api/food?q=${query}`, {
        accept: 'application/json',
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);

}

function login(user, cb) {
    fetch('/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function getGoals(cb) {
    fetch('/api/goals/', {
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
    fetch('/api/bucket/', {
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

function addGoal(goal, cb) {
    fetch('/api/goals/', {
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

function editGoal(toEdit, cb) {
    fetch('api/goals/', {
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
    fetch(`api/goals/${goalId}`, {
        method: 'DELETE',
        credentials: 'include'
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
    search, getBuckets, getGoals, addGoal, editGoal, deleteGoal, login
};

export default Client;
