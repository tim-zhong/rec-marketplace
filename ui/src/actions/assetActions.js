import { assetConstants } from '../constants/assetConstants';
import { assetService } from '../services/assetService';
import { alertError } from './alertActions';

/**
 * removeAllCoins removes all coins date from the store.
 */
export const removeAllCoins = () => ({ type: assetConstants.COINS.REMOVE_ALL });

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

const getCreatorByName = name => {
    switch (name) {
        case 'bid':
            return {
                actionTypes: assetConstants.BIDS,
                create: assetService.createBid,
            };
        case 'listing':
            return {
                actionTypes: assetConstants.LISTINGS,
                create: assetService.createListing,
            };
        case 'cancelCoin':
            return {
                // For transactions, use action types of the assets that
                // is the most relevent to the transaction
                actionTypes: assetConstants.COINS,
                create: assetService.cancelCoin,
            }
        case 'endListing':
            return {
                actionTypes: assetConstants.LISTINGS,
                create: assetService.endListing,
            }
        default:
            throw new Error(`No matching creator for asset/transaction name: ${name}`);
    }
}

/**
 * Create assets of a given type.
 * Since the request logic are very similat, I decided not to
 * write seperate actions for assets and transactions.
 * Relies on Redux Thunk middleware.
 * @param {String} name - Name of the asset / transaction
 */
export const createAssetOrTransaction = (name, ...rest) => dispatch => {
    const creator = getCreatorByName(name);

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
