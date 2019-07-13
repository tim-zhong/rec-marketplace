import { assetConstants } from '../constants/assetConstants';
import { assetService } from '../services/assetService';
import { alertError } from './alertActions';

/**
 * Returns the corresponsing data fetcher.
 * A data fetcher is an object that encapsulates the available actions for that asset, and
 * a function to fetch data from API.
 * @param {String} assetName - Name of the asset (e.g. activeListings, listedCoins).
 */
const getDataFetcherByAssetName = assetName => {
    switch (assetName) {
        case 'activeListings':
            return {
                actionTypes: assetConstants.LISTINGS,
                fetch: assetService.fetchActiveListings,
            };
        case 'listingsByUser':
            return {
                actionTypes: assetConstants.LISTINGS,
                fetch: assetService.fetchListingsByUser,
            };
        case 'listedCoins':
            return {
                actionTypes: assetConstants.COINS,
                fetch: assetService.fetchListedCoins,
            };
        case 'coinsByUser':
            return {
                actionTypes: assetConstants.COINS,
                fetch: assetService.fetchCoinsByUser,
            };
        case 'bidsByListing':
            return {
                actionTypes: assetConstants.BIDS,
                fetch: assetService.fetchBidsByListing,
            }
        case 'bidsByUser':
            return {
                actionTypes: assetConstants.BIDS,
                fetch: assetService.fetchBidsByUser,
            }
        default:
            throw new Error(`No matching fetcher for asset name: ${assetName}`);
    }
}

/**
 * Fetch assets of a given type.
 * Relies on Redux Thunk middleware.
 * @param {String} assetName - Name of the asset
 */
export const fetchAsset = (assetName, ...rest) => dispatch => {
    const fetcher = getDataFetcherByAssetName(assetName);

    const {
        FETCH_ASSET_REQUEST,
        FETCH_ASSET_SUCCESS,
        FETCH_ASSET_FAILURE,
    } = fetcher.actionTypes;

    // initiate request
    dispatch({ type: FETCH_ASSET_REQUEST });

    return fetcher.fetch(...rest)
        .then(
            data => {
                dispatch({ type: FETCH_ASSET_SUCCESS, data });
            }
        )
        .catch(
            error => {
                dispatch(alertError(error));
                dispatch({ type: FETCH_ASSET_FAILURE });
            }
        );
}

const getAssetCreatorByAssetName = assetName => {
    switch (assetName) {
        case 'bid':
            return {
                actionTypes: assetConstants.BIDS,
                create: assetService.createBid,
            };
        default:
            throw new Error(`No matching creator for asset name: ${assetName}`);
    }
}

/**
 * Create assets of a given type.
 * Relies on Redux Thunk middleware.
 * @param {String} assetName - Name of the asset
 */
export const createAsset = (assetName, ...rest) => dispatch => {
    const creator = getAssetCreatorByAssetName(assetName);

    const {
        POST_ASSET_REQUEST,
        POST_ASSET_SUCCESS,
        POST_ASSET_FAILURE,
    } = creator.actionTypes;

    // initiate request
    dispatch({ type: POST_ASSET_REQUEST });

    return creator.create(...rest)
        .then(
            data => {
                dispatch({ type: POST_ASSET_SUCCESS, data });
            }
        )
        .catch(
            error => {
                dispatch(alertError(error));
                dispatch({ type: POST_ASSET_FAILURE, error });
            }
        );
}
