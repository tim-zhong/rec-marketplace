import { sessionConstants } from '../constants/sessionConstants';

/**
 * Action to indicate that start of authentication.
 */
export const authRequest = () => ({
    type: sessionConstants.AUTH_REQUEST
});

/**
 * Action to indicate successful authentication.
 */
export const authSuccess = () => ({
    type: sessionConstants.AUTH_SUCCESS
});

/**
 * Action to indicate authentication failure.
 */
export const authFailure = () => ({
    type: sessionConstants.AUTH_FAILURE
});
