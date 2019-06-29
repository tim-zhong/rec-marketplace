import { hyperledgerClient } from '../helpers/hyperledgerClient';

/**
 * Service function for fetching active coin listings.
 */
const fetchActiveListings = () => {
    return hyperledgerClient.get('/queries/selectActiveListings')
        .then(listings => listings)
        .catch(err => Promise.reject('Failed to fetch listing.'));
}

/**
 * Service function for fetching listed coins.
 */
const fetchListedCoins = () => {
    return hyperledgerClient.get('/queries/selectListedCoins')
        .then(listings => listings)
        .catch(err => Promise.reject('Failed to fetch listed coins.'));
}

export const assetService = {
    fetchActiveListings,
    fetchListedCoins,
}
