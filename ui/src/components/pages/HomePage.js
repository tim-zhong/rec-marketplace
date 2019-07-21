import React from 'react';
import { connect } from 'react-redux';
import { fetchAsset, createAssetOrTransaction } from '../../actions/assetActions';
import { message } from 'antd';
import Layout from '../layout/Layout';
import ListingTable from '../ListingTable';

const { Header, Content, Loading } = Layout;

class HomePage extends React.Component {
    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        const { alert } = this.props;
        if (prevProps.alert.message !== alert.message) {
            if (alert.type === 'success')
                message.success(alert.message);
            else if (alert.type === 'error')
                message.error(alert.message);
        }
    }

    loadData = () => {
        this.props.fetchAsset('activeListings');
        this.props.fetchAsset('listedCoins');
    }

    postBid = (bidPrice, listingId) =>
        this.props.createAssetOrTransaction('bid', bidPrice, listingId, this.props.user.userId)
            .then(this.loadData);

    render() {
        const { user, isDataReady } = this.props;
        return (
            <Layout>
                {!isDataReady &&  <Loading />}
                <Header user={user} selected="home" />
                {isDataReady &&
                    <Content offset={0}>
                        <h1>Coins Listed For Sale</h1>
                        <ListingTable onPlaceBid={this.postBid} />
                    </Content>
                }
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    user: state.session.user,
    alert: state.alert,
    isDataReady: state.assets.listings.requestState.success
        && state.assets.coins.requestState.success
        && !state.assets.bids.requestState.busy,
});

export default connect(mapStateToProps, {
    fetchAsset,
    createAssetOrTransaction,
})(HomePage);
