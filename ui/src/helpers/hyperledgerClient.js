// TODO: error handling
// TODO: may be use path to simplify url constucting

// TODO: these should be in some config file
const API_ROOT = 'http://localhost:3000/';
const BIZ_NET_DOMAIN = 'org.rec';

/**
 * Helper method to generate ids for assets. We need this because Composer does
 * not automatically generate ids for new assets.
 */
function getRandomHash(length = 5) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function parseJSON(response) {
    return response.json();
}

function buildAssetRefString(assetName, id) {
    return `resource:${BIZ_NET_DOMAIN}.${assetName}#${id}`;
}

function buildClassRefString(className) {
    return `${BIZ_NET_DOMAIN}.${className}`;
}

function getIdFromRefString(refString) {
    return refString.split('#')[1] || '';
}

function get(path, params = {}) {
    const query = Object.keys(params)
        .map(key => key + '=' +
            (typeof params[key] === 'object'
                ? JSON.stringify(params[key]).replace('#', '%23')
                : params[key]).replace('#', '%23')
        )
        .join('&');

    return new Promise((resolve, reject) => {
        return fetch(`${API_ROOT}api${path}?${query}`, {accpet: 'application/json'})
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
    getRandomHash,
    buildAssetRefString,
    buildClassRefString,
    getIdFromRefString,
    get,
    post,
};
