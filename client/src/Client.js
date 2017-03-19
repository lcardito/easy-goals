/* eslint-disable no-undef */
function search(query, cb) {

    return fetch(`api/food?q=${query}`, {
        accept: 'application/json',
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);

}

function getAccounts(cb) {
    fetch('api/account/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function addAccount(account, cb) {
    fetch('api/account/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(account)
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

// function deleteAccount(accountId, cb) {
//     fetch(`api/account/{accountId}`, {
//         method: 'DELETE'
//     }).then(checkStatus);
// }

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

const Client = {search, getAccounts, addAccount};
export default Client;
