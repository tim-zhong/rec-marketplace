import { sessionConstants } from '../constants/sessionConstants';
import { sessionService } from '../services/sessionService';
import { alertError } from './alertActions';
import { history } from '../helpers/history';

/**
 * Login using specified username and password.
 * Relies on Redux Thunk middleware.
 * @param {String} username 
 * @param {String} password 
 */
export const login = (username, password) => dispatch => {
    const { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } = sessionConstants;
    
    // initiate request
    dispatch({ type: LOGIN_REQUEST });

    sessionService.login(username, password)
        .then(
            user => {
                dispatch({ type: LOGIN_SUCCESS, user });
                history.push('/');
            }
        )
        .catch(
            error => {
                dispatch({ type: LOGIN_FAILURE, error });
                dispatch(alertError(error));
            }
        );
}

/**
 * Logout user
 */
export const logout = () => {
    sessionService.logout();
    return { type: sessionConstants.LOGOUT };
}
