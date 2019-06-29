import { combineReducers } from 'redux';
import { alert } from './alertReducer';
import { session } from './sessionReducer';
import { assets } from './assetReducer';
import { sessionConstants } from '../constants/sessionConstants';

const appReducer = combineReducers({
    alert,
    session,
    assets,
});

const rootReducer = (state, action) => {
    if (action.type === sessionConstants.LOGOUT) {
        // Wipe out state unpon logout
        state = undefined
    }

    return appReducer(state, action)
}

export default rootReducer;
