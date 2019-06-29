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
        case 'listedCoins':
            return {
                actionTypes: assetConstants.COINS,
                fetch: assetService.fetchListedCoins,
            };
        default:
            throw new Error(`No matching fetcher for asset name: ${assetName}`);
    }
}

/**
 * Fetch assets of a given type.
 * Relies on Redux Thunk middleware.
 * @param {String} assetName - Name of the asset
 */
export const fetchAsset = assetName => dispatch => {
    const fetcher = getDataFetcherByAssetName(assetName);

    const {
        FETCH_ASSET_REQUEST,
        FETCH_ASSET_SUCCESS,
        FETCH_ASSET_FAILURE,
    } = fetcher.actionTypes;

    // initiate request
    dispatch({ type: FETCH_ASSET_REQUEST });

    fetcher.fetch()
        .then(
            results => {
                dispatch({ type: FETCH_ASSET_SUCCESS, results });
            }
        )
        .catch(
            error => {
                dispatch(alertError(error));
                dispatch({ type: FETCH_ASSET_FAILURE, error });
            }
        );
}
