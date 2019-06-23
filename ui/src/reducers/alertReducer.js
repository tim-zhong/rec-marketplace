import { alertConstants }  from '../constants/alertConstants';

export function alert(state = {}, action) {
    const { type, message } = action;
    switch (type) {
        case alertConstants.SUCCESS:
            return { type: 'success', message }
        case alertConstants.ERROR:
            return { type: 'error', message }
        case alertConstants.CLEAR:
            return {};
        default:
            return state;
    }
}
