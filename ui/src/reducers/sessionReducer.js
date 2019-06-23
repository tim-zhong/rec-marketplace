import { sessionConstants }  from '../constants/sessionConstants';

export function session(state = {}, action) {
    const { type } = action;
    switch (type) {
        case sessionConstants.AUTH_REQUEST:
            return { loggingIn: true }
        case sessionConstants.AUTH_SUCCESS:
            return { loggedIn: true }
        case sessionConstants.AUTH_FAILURE:
            return {};
        default:
            return state;
    }
}
