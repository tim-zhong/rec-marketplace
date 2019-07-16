import { assetConstants }  from '../constants/assetConstants';
import { combineReducers } from 'redux';
import _ from 'lodash';

const initialState = {
    requestState: {},
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
        POST_ASSET_REQUEST,
        POST_ASSET_SUCCESS,
        POST_ASSET_FAILURE,
        REMOVE_ALL,
    } = actionTypes;

    return (state = initialState, action) => {
        const { type, data } = action;
        switch (type) {
            case REMOVE_ALL:
                return initialState;
            case FETCH_ASSET_REQUEST:
                return { ...state, requestState: { busy: true } };
            case FETCH_ASSET_SUCCESS:
                const entities = {
                    byId: {
                        ...state.entities.byId,
                        ...data.entities.byId,
                    }
                };
                const result = _.union(state.result, data.result);
                return { entities, result, requestState: { success: true } };
            case FETCH_ASSET_FAILURE:
                return { ...state, requestState: { failed: true } };
            case POST_ASSET_REQUEST:
                return { ...state, requestState: { busy: true } };
            case POST_ASSET_SUCCESS:
                return { ...state, requestState: { success: true } };
            case POST_ASSET_FAILURE:
                    return { ...state, requestState: { failed: true } };
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
