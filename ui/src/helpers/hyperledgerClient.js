// TODO: error handling
// TODO: may be use path to simplify url constucting

// TODO: this should be in some config file
const API_ROOT = 'http://localhost:3000/';

function parseJSON(response) {
    return response.json();
}

function buildRefString(model, idKey) {
    return `${model['$class']}#${model[idKey]}`;
}

function getIdFromRefString(refString) {
    return refString.split('#')[1] || '';
}

function get(path, filter) {
    const filterString = filter
        ? `?filter=${JSON.stringify(filter).replace('#', '%23')}`
        : '';

    return new Promise((resolve, reject) => {
        return fetch(`${API_ROOT}api${path}${filterString}`, {accpet: 'application/json'})
            .then(parseJSON)
            .then(resolve)
    });
}

function post(type, data) {
    return new Promise((resolve, reject) => {
        return fetch(`${API_ROOT}api${type}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(parseJSON).then(resolve);
    })
}

export const hyperledgerClient = {
    buildRefString,
    getIdFromRefString,
    get,
    post,
};
