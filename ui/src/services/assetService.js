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
/*
listings: 
    [
        {
            $class: "org.rec.CoinListing"
            bidPrices: [13]
            coin: "resource:org.rec.Coin#0001"
            listingId: "0001"
            minPrice: 11
            state: "ACTIVE"
            user: "resource:org.rec.User#user-alice"
        },
        ...
    ]
*/
const fetchActiveListings = () => {
    return hyperledgerClient.get('/queries/selectActiveListings')
        .then(listings => normalize(listings, [listingSchema]))
        .catch(err => Promise.reject('Failed to fetch listing.'));
}

/**
 * Service function for fetching coin listings for a user.
 */
/*
user: 'resource:org.rec.User#user-alice'

listings:
    [
        {
            $class: "org.rec.CoinListing"
            bidPrices: [13]
            coin: "resource:org.rec.Coin#0001"
            listingId: "0001"
            minPrice: 11
            state: "ACTIVE"
            user: "resource:org.rec.User#user-alice"
        },
        ...
    ]
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
/*
coins: 
    [
        {
            $class: "org.rec.Coin"
            active: true
            assetType: "WIND"
            cO2UsedForCertificate: 0
            capacityWh: 10000
            certificatesCreatedForWh: 0
            city: "Waterloo"
            coinId: "0000"
            complianceRegistry: "none"
            country: "Canada"
            gpsLatitude: "0"
            gpsLongitude: "0"
            houseNumber: "8"
            lastSmartMeterCO2OffsetRead: 0
            lastSmartMeterReadFileHash: ""
            lastSmartMeterReadWh: 0
            operationalSince: 1514764800
            otherGreenAttributes: "N.A."
            owner: "resource:org.rec.User#user-alice"
            region: "Ontario"
            smartMeter: "0x343854a430653571b4de6bf2b8c475f828036c30"
            state: "LISTED"
            street: "Main Street"
            typeOfPublicSupport: "N.A"
            zip: "XXX XXX"
        },
        ...
    ]
*/
const fetchListedCoins = () => {
    return hyperledgerClient.get('/queries/selectListedCoins')
        .then(coins => normalize(coins, [coinSchema]))
        .catch(err => Promise.reject('Failed to fetch listed coins.'));
}

/**
 * Service function for fetching coins belong to a user.
 */
/*
user: 'resource:org.rec.User#user-alice'

coins: 
    [
        {
            $class: "org.rec.Coin",
            active: true,
            assetType: "WIND",
            cO2UsedForCertificate: 0,
            capacityWh: 10000,
            certificatesCreatedForWh: 0,
            city: "Waterloo",
            coinId: "0000",
            complianceRegistry: "none",
            country: "Canada",
            gpsLatitude: "0",
            gpsLongitude: "0",
            houseNumber: "8",
            lastSmartMeterCO2OffsetRead: 0,
            lastSmartMeterReadFileHash: "",
            lastSmartMeterReadWh: 0,
            operationalSince: 1514764800,
            otherGreenAttributes: "N.A.",
            owner: "resource:org.rec.User#user-alice",
            region: "Ontario",
            smartMeter: "0x343854a430653571b4de6bf2b8c475f828036c30",
            state: "LISTED",
            street: "Main Street",
            typeOfPublicSupport: "N.A",
            zip: "XXX XXX"
        },
        ...
    ]
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
/*
userId: 'user-alice'
user: 'resource:org.rec.User#user-alice'

bids: 
    [
        {
            $class: "org.rec.Bid",
            bidId: "z8tnJ",
            bidPrice: 15,
            listing: "resource:org.rec.CoinListing#0000",
            state: "SUBMITTED",
            user: "resource:org.rec.User#user-alice"
        },
        ...
    ]
*/
const fetchBidsByUser = userId => {
    const { buildAssetRefString } = hyperledgerClient;
    const user = buildAssetRefString('User', userId);
    return hyperledgerClient.get('/queries/selectBidsByUser', { user })
        .then(bids => normalize(bids, [bidSchema]))
        .catch(err => Promise.reject('Failed to fetch bids by user.'));
}

/**
 * Service function for creating coin listings.
 */
/*
minPrice: 12
coinId: '0000'

data: 
    {
        $class: "org.rec.ListCoin",
        coin: "resource:org.rec.Coin#0005",
        listingId: "yAMrZ",
        minPrice: 12
    }
*/
const createListing = (minPrice, coinId) => {
    const { getRandomHash, buildAssetRefString, buildClassRefString } = hyperledgerClient;
    const listingId = getRandomHash();
    const coin = buildAssetRefString('Coin', coinId);

    const data = { listingId, minPrice, coin };
    // TODO: move it to hyperledgerClient
    data['$class'] = buildClassRefString('ListCoin');

    return hyperledgerClient.post('/ListCoin', data);
}

/**
 * Service function for ending coin listings.
 */
/*
listingId: '0000'

data:
    {
        $class: "org.rec.EndListing",
        listing: "resource:org.rec.CoinListing#0000"
    }
*/
const endListing = listingId => {
    const { buildAssetRefString, buildClassRefString } = hyperledgerClient;
    const listing = buildAssetRefString('CoinListing', listingId);

    const data = { listing };
    // TODO: move it to hyperledgerClient
    data['$class'] = buildClassRefString('EndListing');

    return hyperledgerClient.post('/EndListing', data);
}

/**
 * Service function for creating bids.
 */
/*
bidPrice: 16
listingId: '0001'
userId: 'user-alice'

data:
    {
        $class: "org.rec.PlaceBid",
        bidId: "AhIzR",
        bidPrice: 16,
        listing: "resource:org.rec.CoinListing#0001",
        user: "resource:org.rec.User#user-alice"
    }
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

/**
 * Service function for cancelling coins.
 */
/*
coinId: '0000'

data:
    {
        $class: "org.rec.CancelCoin",
        coin: "resource:org.rec.Coin#0000"
    }
*/
const cancelCoin = coinId => {
    const { buildAssetRefString, buildClassRefString } = hyperledgerClient;
    const coin = buildAssetRefString('Coin', coinId);

    const data = { coin };
    // TODO: move it to hyperledgerClient
    data['$class'] = buildClassRefString('CancelCoin');

    return hyperledgerClient.post('/CancelCoin', data);
}

export const assetService = {
    fetchActiveListings,
    fetchListingsByUser,
    fetchListedCoins,
    fetchCoinsByUser,
    fetchBidsByUser,
    
    createListing,
    endListing,
    createBid,
    cancelCoin,
}
