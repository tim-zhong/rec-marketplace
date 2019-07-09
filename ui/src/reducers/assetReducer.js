import { assetConstants }  from '../constants/assetConstants';
import { combineReducers } from 'redux';
import _ from 'lodash';

const initialState = {
    entities: {
        byId: {},
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
        const { type, data, error } = action;
        switch (type) {
            case FETCH_ASSET_REQUEST:
                return { ...state, fetching: true };
            case FETCH_ASSET_SUCCESS:
                const entities = {
                    byId: {
                        ...state.entities.byId,
                        ...data.entities.byId,
                    }
                };
                const result = _.union(state.result, data.result);
                return { entities, result, success: true};
            case FETCH_ASSET_FAILURE:
                return { ...state, error: error };
            default:
                return state;
        }
    }
}

const listings = buildBasicAssetReducer(assetConstants.LISTINGS);
const coins = buildBasicAssetReducer(assetConstants.COINS);
const bids = buildBasicAssetReducer(assetConstants.BIDS);

export const assets = combineReducers({
    listings,
    coins,
    bids,
});
