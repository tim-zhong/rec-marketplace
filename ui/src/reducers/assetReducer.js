import { assetConstants }  from '../constants/assetConstants';
import { combineReducers } from 'redux';

const initialState = {
    entities: {
        byId: [],
    },
    result: [],
};
/**
 * Builds a reducer that supports the basic data flow for an asset.
 * @param {Object} actionTypes - list of required action types for the reducer to hook up with.
 */
const buildBasicAssetReducer = actionTypes => {
    const {
        FETCH_ASSET_REQUEST,
        FETCH_ASSET_SUCCESS,
        FETCH_ASSET_FAILURE,
    } = actionTypes;

    return (state = initialState, action) => {
        switch (action.type) {
            case FETCH_ASSET_REQUEST:
                return { ...state, fetching: true };
            case FETCH_ASSET_SUCCESS:
                return { ...action.results, success: true};
            case FETCH_ASSET_FAILURE:
                return { ...state, error: action.error };
            default:
                return state;
        }
    }
}

const listings = buildBasicAssetReducer(assetConstants.LISTINGS);
const coins = buildBasicAssetReducer(assetConstants.COINS);

export const assets = combineReducers({
    listings,
    coins,
});
