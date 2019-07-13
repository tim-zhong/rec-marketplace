import { hyperledgerClient } from '../helpers/hyperledgerClient';
import { normalize, schema } from 'normalizr';

// We use this Normalizr schemas to transform API responses into objects 
// that Redux reduxers can easily consume.
const listingSchema = new schema.Entity('byId', {}, { idAttribute: listing => listing.listingId });
const coinSchema = new schema.Entity('byId', {}, { idAttribute: coin => coin.coinId });
const bidSchema = new schema.Entity('byId', {}, { idAttribute: bid => bid.bidId });

/**
 * Service function for fetching active coin listings.
 */
const fetchActiveListings = () => {
    return hyperledgerClient.get('/queries/selectActiveListings')
        .then(listings => normalize(listings, [listingSchema]))
        .catch(err => Promise.reject('Failed to fetch listing.'));
}

/**
 * Service function for fetching coin listings for a user.
 */
const fetchListingsByUser = userId => {
    const { buildAssetRefString } = hyperledgerClient;
    const user = buildAssetRefString('User', userId);
    return hyperledgerClient.get('/queries/selectListingsByUser', { user })
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

/**
 * Service function for fetching coins belong to a user.
 */
const fetchCoinsByUser = userId => {
    const { buildAssetRefString } = hyperledgerClient;
    const user = buildAssetRefString('User', userId);
    return hyperledgerClient.get('/queries/selectCoinsByUser', {user})
        .then(coins => normalize(coins, [coinSchema]))
        .catch(err => Promise.reject('Failed to fetch coins by user.'));
}

/**
 * Service function for fetching listed coins.
 */
const fetchBidsByListing = listingId => {
    return hyperledgerClient.get('/Bid', { filter: {'WHERE': {'listing': listingId}}})
        .then(bids => normalize(bids, [bidSchema]))
        .catch(err => Promise.reject('Failed to fetch listed bids by listing.'));
}

/**
 * Service function for fetching listed coins.
 */
const fetchBidsByUser = userId => {
    const { buildAssetRefString } = hyperledgerClient;
    const user = buildAssetRefString('User', userId);
    return hyperledgerClient.get('/queries/selectBidsByUser', { user })
        .then(bids => normalize(bids, [bidSchema]))
        .catch(err => Promise.reject('Failed to fetch bids by user.'));
}

/**
 * Service function for fetching listed coins.
 */
const createBid = (bidPrice, listingId, userId) => {
    const { getRandomHash, buildAssetRefString, buildClassRefString } = hyperledgerClient;
    const bidId = getRandomHash();
    const listing = buildAssetRefString('CoinListing', listingId);
    const user = buildAssetRefString('User', userId);

    const data = { bidId, bidPrice, listing, user };
    // TODO: move it to hyperledgerClient
    data['$class'] = buildClassRefString('PlaceBid');

    return hyperledgerClient.post('/PlaceBid', data);
}

export const assetService = {
    fetchActiveListings,
    fetchListingsByUser,
    fetchListedCoins,
    fetchCoinsByUser,
    fetchBidsByListing,
    fetchBidsByUser,
    
    createBid,
}
