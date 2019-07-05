import { createSelector } from 'reselect';
import { hyperledgerClient } from '../helpers/hyperledgerClient';
import _ from 'lodash';

// Why do we use selectors?
// 1. Computing derived data: Selectors can compute derived data, allowing Redux to store the minimal possible state.
// 2. Memoization: Selectors are efficient. A selector is not recomputed unless one of its arguments changes.
// More details here: https://github.com/reduxjs/reselect

const { getIdFromRefString } = hyperledgerClient;

const listingIdsSelector = state => state.assets.listings.result;
const listingDataSelector = state => state.assets.listings.entities.byId;
const coinIdsSelector = state => state.assets.coins.entities.result;
const coinDataSelector = state => state.assets.coins.entities.byId;

export const listingsSelector = createSelector(
    [listingIdsSelector, listingDataSelector],
    (ids, data) => _.map(ids, id => ({...data[id], key: id}))
);

export const listingsWithCoinDataSelector = createSelector(
    [coinDataSelector, listingsSelector],
    (coinData, listings) => {
        return _.map(
            listings,
            listing => ({...listing, coin: coinData[getIdFromRefString(listing.coin)]})
        );
    }
);

export const coinsSelector = createSelector(
    [coinIdsSelector, coinDataSelector],
    (ids, data) => _.map(ids, id => ({...data[id], key: id}))
);
