import { alertConstants } from '../constants/alertConstants';

/**
 * Action to show a success message.
 * @param {message} message - alert message to show
 */
const success = message => ({
    type: alertConstants.SUCCESS,
    message,
});

/**
 * Action to show a error message.
 * @param {message} message - alert message to show
 */
const error = message => ({
    type: alertConstants.ERROR,
    message,
});

/**
 * Clear existing alerts.
 */
const clear = () => ({
    type: alertConstants.CLEAR
});

export const alertActions = {
    success,
    error,
    clear,
 };
