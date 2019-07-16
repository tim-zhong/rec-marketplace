import { sessionConstants }  from '../constants/sessionConstants';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : {};

export function session(state = initialState, action) {
    const { type } = action;
    const {
        LOGIN_REQUEST,
        LOGIN_SUCCESS,
        LOGIN_FAILURE,
        LOGOUT,
        REFETCH_USER_SUCCESS,
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
        case REFETCH_USER_SUCCESS:
            return { ...state, user: action.user }
        default:
            return state;
    }
}
