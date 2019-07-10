import React from 'react';
import { connect } from 'react-redux';
import { fetchAsset, createAsset } from '../actions/assetActions';
import Layout from './layout/Layout';
import ListingTable from './ListingTable';

const { Header, Content } = Layout;

class HomePage extends React.Component {
    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.props.fetchAsset('activeListings');
        this.props.fetchAsset('listedCoins');
    }

    fetchBidsByListing = listingId => this.props.fetchAsset('bidsByListing', listingId);

    postBid = (bidPrice, listingId) => this.props.createAsset('bid', bidPrice, listingId, this.props.user.userId);

    render() {
        const { user } = this.props;
        return (
            <Layout>
                <Header user={user} selected="home" />
                <Content>
                    <h1>Coins Listed For Sale</h1>
                    <ListingTable
                        fetchBidsByListing={this.fetchBidsByListing}
                        onPlaceBid={this.postBid}
                    />
                </Content>
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    user: state.session.user,
    alert: state.alert,
});

export default connect(mapStateToProps, {
    fetchAsset,
    createAsset,
})(HomePage);
