/**
 * Place a bid on a listing
 * @param {org.rec.PlaceBid} PlaceBid - the PlaceBid transaction
 * @transaction
 */
async function placeBid(placeBidTransaction) {
    const { bidId, bidPrice, listing, user } = placeBidTransaction;

    if (listing.state !== 'ACTIVE') {
        throw new Error('Listing is not longer active');
    }
	if (user.balance < bidPrice) {
        throw new Error('Insufficient balance');
    }

    user.balance -= bidPrice;
    listing.bidPrices.push(bidPrice);

	const factory = getFactory();
	const newBid = factory.newResource(
        'org.rec',
        'Bid',
        bidId
    );
    newBid.bidPrice = bidPrice;
    newBid.listing = listing;
    newBid.user = user;

    await getParticipantRegistry('org.rec.User')
        .then(registry => registry.update(user));
    await getAssetRegistry('org.rec.CoinListing')
        .then(registry => registry.update(listing));
    await getAssetRegistry('org.rec.Bid')
        .then(registry => registry.add(newBid));
}

/**
 * List a coin on the marketplace
 * @param {org.rec.ListCoin} ListCoin - the ListCoin transaction
 * @transaction
 */
async function listCoin(listCoinTransaction) {
    const { coin, listingId, minPrice } = listCoinTransaction;
    
    if (coin.state === 'LISTED') {
        throw new Error('Cannot list a listed coin');
    }
    if (coin.sate === 'CANCELLED') {
        throw new Error('Cannot list a cancelled coin');
    }
    
    coin.state = 'LISTED';
    const factory = getFactory();
    const newListing = factory.newResource(
        'org.rec',
        'CoinListing',
        listingId
    );
    newListing.user = coin.owner;
    newListing.coin = coin;
    newListing.minPrice = minPrice;

    await getAssetRegistry('org.rec.Coin')
        .then(registry => registry.update(coin));
    await getAssetRegistry('org.rec.CoinListing')
        .then(registry => registry.add(newListing));
}

/**
 * Cancel a coin and all its listings
 * @param {org.rec.CancelCoin} CancelCoin - the CancelCoin transaction
 * @transaction
 */
async function cancelCoin(cancelCoinTransaction) {
    const { coin } = cancelCoinTransaction;
    
    if (coin.sate === 'CANCELLED') {
        throw new Error('Coin has already been cancelled');
    }
    
    coin.state = 'CANCELLED';
  	const coinResourceId = `resource:${coin.getFullyQualifiedIdentifier()}`;
    const activeListings = await query('selectActiveListingsByCoin', { coin: coinResourceId });
    activeListings.forEach(listing => Object.assign(listing, { state: 'CANCELLED' }));
    
    await getAssetRegistry('org.rec.CoinListing')
        .then(registry => registry.updateAll(activeListings));
    await getAssetRegistry('org.rec.Coin')
        .then(registry => registry.update(coin));
}
