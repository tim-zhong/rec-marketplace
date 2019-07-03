import { hyperledgerClient } from '../helpers/hyperledgerClient';
import { normalize, schema } from 'normalizr';

// We use this Normalizr schemas to transform API responses into objects 
// that Redux reduxers can easily consume.
const listingSchema = new schema.Entity('byId', {}, { idAttribute: listing => listing.listingId });
const coinSchema = new schema.Entity('byId', {}, { idAttribute: coin => coin.coinId });

/**
 * Service function for fetching active coin listings.
 */
const fetchActiveListings = () => {
    return hyperledgerClient.get('/queries/selectActiveListings')
        .then(listings => normalize(listings, [listingSchema]))
        .catch(err => Promise.reject('Failed to fetch listing.'));
}

/**
 * Service function for fetching listed coins.
 */
const fetchListedCoins = () => {
    return hyperledgerClient.get('/queries/selectListedCoins')
        .then(coins => normalize(coins, [coinSchema]))
        .catch(err => Promise.reject('Failed to fetch listed coins.'));
}

export const assetService = {
    fetchActiveListings,
    fetchListedCoins,
}