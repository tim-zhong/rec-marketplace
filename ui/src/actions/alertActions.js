import { alertConstants } from '../constants/alertConstants';

/**
 * Action to show a success message.
 * @param {message} message - alert message to show
 */
export const alertSuccess = message => ({
    type: alertConstants.SUCCESS,
    message,
});

/**
 * Action to show a error message.
 * @param {message} message - alert message to show
 */
export const alertError = message => ({
    type: alertConstants.ERROR,
    message,
});

/**
 * Clear existing alerts.
 */
export const alertClear = () => ({
    type: alertConstants.CLEAR
});
