import { hyperledgerClient } from '../helpers/hyperledgerClient';

/**
 * Service function for login.
 * For now we only check the existence of a user whoes first name matched the provided username.
 * @param {String} username
 * @param {String} password
 */
function login(username, password) {
    return hyperledgerClient.get('/User', { filter: { where: { firstName: username }}})
        .then(users => {
            if (users.length > 0) {
                // store user details and token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(users[0]));
                return users[0];
            }
            return Promise.reject('Login Failed.');
        });
}

/**
 * Service function for re-fetching user data.
 */
function refetchUser() {
    const { userId } = JSON.parse(localStorage.getItem('user'));
    return hyperledgerClient.get('/User', { filter: { where: { userId }}})
        .then(users => {
            if (users.length > 0) {
                // store user details and token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(users[0]));
                return users[0];
            }
            return Promise.reject('Refetch Failed.');
        });
}

/**
 * Service function for logout.
 */
function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

export const sessionService = {
    login,
    logout,
    refetchUser,
}
