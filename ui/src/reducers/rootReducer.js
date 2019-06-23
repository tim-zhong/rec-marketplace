import { combineReducers } from 'redux';
import { alert } from './alertReducer';
import { session } from './sessionReducer';

const rootReducer = combineReducers({
    alert,
    session,
});

export default rootReducer;
