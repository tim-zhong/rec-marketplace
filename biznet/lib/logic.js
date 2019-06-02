/**
 * List a coin on the marketplace
 * @param {org.rec.ListCoin} ListCoin - the ListCoin transaction
 * @transaction
 */
async function listCoin(listCoinTransaction) {
    const { coin, listingId } = listCoinTransaction;
    
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
    newListing.coin = coin;

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

/**
 * Accept an offer and close the bidding
 * @param {org.rec.AcceptOffer} acceptOfferTransaction - the acceptOfferTransaction transaction
 * @transaction
 */
async function acceptOffer(acceptOfferTransaction) {
    const { offer } = acceptOfferTransaction;
    const { listing, user, bidPrice } = offer;

    if (listing.state !== 'ACTIVE') {
        throw new Error('Listing is not longer active');
    }
    if (listing.coin.state !== 'LISTED') {
        throw new Error('Coin is not longer for sale');
    }

    const lastOwner = listing.coin.owner;
    user.balance -= bidPrice;
    lastOwner.balance += bidPrice;
    listing.coin.owner = user;
    listing.coin.state = 'ACTIVE';
    listing.state = 'SOLD';

    await getAssetRegistry('org.rec.Coin')
        .then(registry => registry.update(listing.coin));
    await getParticipantRegistry('org.rec.User')
        .then(registry => registry.updateAll([user, lastOwner]));
    await getAssetRegistry('org.rec.CoinListing')
        .then(registry => registry.update(listing));
}
