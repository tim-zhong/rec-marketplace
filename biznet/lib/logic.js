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
