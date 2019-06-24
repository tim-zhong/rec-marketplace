import { sessionConstants }  from '../constants/sessionConstants';

export function session(state = {}, action) {
    const { type } = action;
    const {
        LOGIN_REQUEST,
        LOGIN_SUCCESS,
        LOGIN_FAILURE,
        LOGOUT,
    } = sessionConstants;
    switch (type) {
        case LOGIN_REQUEST:
            return { loggingIn: true };
        case LOGIN_SUCCESS:
            return { loggedIn: true, user: action.user };
        case LOGIN_FAILURE:
            return {};
        case LOGOUT:
            return {};
        default:
            return state;
    }
}
