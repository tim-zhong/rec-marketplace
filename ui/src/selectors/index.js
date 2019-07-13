import { createSelector } from 'reselect';
import { hyperledgerClient } from '../helpers/hyperledgerClient';
import _ from 'lodash';

// Why do we use selectors?
// 1. Computing derived data: Selectors can compute derived data, allowing Redux to store the minimal possible state.
// 2. Memoization: Selectors are efficient. A selector is not recomputed unless one of its arguments changes.
// More details here: https://github.com/reduxjs/reselect

const { getIdFromRefString } = hyperledgerClient;

const userSelector = state => state.session.user;
const listingIdsSelector = state => state.assets.listings.result;
const listingDataSelector = state => state.assets.listings.entities.byId;
const coinIdsSelector = state => state.assets.coins.result;
const coinDataSelector = state => state.assets.coins.entities.byId;
const bidIdsSelector = state => state.assets.bids.result;
const bidDataSelector = state => state.assets.bids.entities.byId;

/**
 * listingsSelector return an array that contains all the listings in the store.
 */
export const listingsSelector = createSelector(
    [listingIdsSelector, listingDataSelector],
    (ids, data) => _.map(ids, id => ({...data[id], key: id}))
);

/**
 * listingsByUserSelector return an array that contains all the listings belong to a user
 */
export const listingsByUserSelector = createSelector(
    [listingsSelector, userSelector],
    (listings, user) => _.filter(listings, listing => getIdFromRefString(listing.user) === user.userId)
);

/**
 * listingsWithCoinDataSelector return an array that contains all the listings in the store.
 * It also decorates the 'coin' field in each listing with the actual coin data.
 */
export const listingsWithCoinDataSelector = createSelector(
    [coinDataSelector, listingsSelector],
    (coinData, listings) => {
        return _.map(
            listings,
            listing => ({...listing, coin: coinData[getIdFromRefString(listing.coin)]})
        );
    }
);

/**
 * coinsSelector return an array that contains all the coins in the store.
 */
export const coinsSelector = createSelector(
    [coinIdsSelector, coinDataSelector],
    (ids, data) => _.map(ids, id => ({...data[id], key: id}))
);

/**
 * coinsByUserSelector return an array that contains all the coins belong to a user
 */
export const coinsByUserSelector = createSelector(
    [coinsSelector, userSelector],
    (coins, user) => _.filter(coins, coin => getIdFromRefString(coin.owner) === user.userId)
)

/**
 * bidsSelector return an array that contains all the bids in the store.
 */
export const bidsSelector = createSelector(
    [bidIdsSelector, bidDataSelector],
    (ids, data) => _.map(ids, id => ({...data[id], key: id}))
);

/**
 * bidsByUserSelector return an array that contains all the bids belong to a user
 */
export const bidsByUserSelector = createSelector(
    [bidsSelector, userSelector],
    (bids, user) => _.filter(bids, bid => getIdFromRefString(bid.user) === user.userId)
);
