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
    newListing.bidPrices = [];

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
    
    if (coin.state !== 'ACTIVE') {
        throw new Error('Only active coins can be cancelled');
    }
    
    coin.state = 'CANCELLED';
    await getAssetRegistry('org.rec.Coin')
        .then(registry => registry.update(coin));
}

/**
 * End a listing. The coin will be transferred to the highest bidder, and
 * the money will be transferred from the higghest bidder to the seller.
 * If there's no bidder, the listing is still considered ended and the state
 * of the coin will be set to 'ACTIVE' again.
 * @param {org.rec.EndListing} EndListing - the EndListing transaction
 * @transaction
 */
async function endListing(endListingTransaction) {
    const { listing } = endListingTransaction;
    
    if (listing.state !== 'ACTIVE') {
        throw new Error('Listing is not longer active');
    }

    let userRegistry;
    await getParticipantRegistry('org.rec.User')
        .then(registry => userRegistry = registry);
    const coin = listing.coin;
    const origianlOwner = coin.owner;

    const listingResourceId = `resource:${listing.getFullyQualifiedIdentifier()}`;
    const bids = await query('selectBidsByListing', { listing: listingResourceId });

    let highestBid;
    let highestBidder;
    const updatedUsers = [origianlOwner];
    for (const bid of bids) {
        let bidder;
        await userRegistry.get(bid.user.getIdentifier())
            .then(user => bidder = user);
        
        if (!highestBid || bid.bidPrice > highestBid.bidPrice) {
            highestBid = bid;
            highestBidder = bidder;
        }
        // return the amount back to unsuccessful bidders;
        bidder.balance += bid.bidPrice;
        if (bidder.userId !== origianlOwner.userId)
            updatedUsers.push(bidder);
        Object.assign(bid, { state: 'UNSUCCESSFUL' });
    };

    if (highestBid) {
        const finalPrice = highestBid.bidPrice;
        highestBid.state = 'SUCCESSFUL';
        highestBidder.balance -= finalPrice;
        origianlOwner.balance += finalPrice;
        coin.owner = highestBid.user;
    }

    coin.state = 'ACTIVE';
    listing.state = 'ENDED';

    await getParticipantRegistry('org.rec.User')
        .then(registry => registry.updateAll(updatedUsers));
    await getAssetRegistry('org.rec.Bid')
        .then(registry => registry.updateAll(bids));
    await getAssetRegistry('org.rec.CoinListing')
        .then(registry => registry.update(listing));
    await getAssetRegistry('org.rec.Coin')
        .then(registry => registry.update(coin));
}
