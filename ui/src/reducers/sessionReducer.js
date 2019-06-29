import { sessionConstants }  from '../constants/sessionConstants';

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : {};

export function session(state = initialState, action) {
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
