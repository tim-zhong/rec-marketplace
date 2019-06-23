import { alertConstants } from '../constants/alertConstants';

/**
 * Action to show a success message.
 * @param {message} message - alert message to show
 */
function success(message) {
    return { type: alertConstants.SUCCESS, message };
}

/**
 * Action to show a error message.
 * @param {message} message - alert message to show
 */
function error(message) {
    return { type: alertConstants.ERROR, message };
}
/**
 * Clear existing alerts.
 * @param {message} message - alert message to show
 */
function clear(message) {
    return { type: alertConstants.CLEAR };
}

export const alertActions = {
    success,
    error,
    clear,
 };
