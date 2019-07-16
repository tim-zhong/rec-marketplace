import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    fetchAsset,
    createAssetOrTransaction,
    removeAllCoins,
} from '../actions/assetActions';
import { refetchUser } from '../actions/sessionActions';
import {
    coinsByUserSelector,
    listingsWithCoinDataByUserSelector,
    bidsByUserSelector
} from '../selectors';
import PrivateRoute from '../components/PrivateRoute';
import { Statistic } from 'antd';
import Layout from './layout/Layout';
import MyCoinsTable from './MyCoinsTable';
import MyListingsTable from './MyListingsTable';
import MyBidsTable from './MyBidsTable';
import _ from 'lodash';
import '../styles/DashboardPage.less';

const { Header, Sider, Content, Loading } = Layout;

// TODO: create a factory for nav items
class DashboardPage extends React.Component {
    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        const { user, fetchAsset, updateUserData, removeAllCoins } = this.props;
        
        // These two lines are for updating coins count after ending a list.
        // Very hacky, I need to refactor this.
        removeAllCoins();
        fetchAsset('listedCoins');
        
        updateUserData();
        fetchAsset('coinsByUser', user.userId);
        fetchAsset('listingsByUser', user.userId);
        fetchAsset('bidsByUser', user.userId);
    }

    sellCoin = (minPrice, coinId) => {
        const { user, createAssetOrTransaction, fetchAsset } = this.props;
        createAssetOrTransaction('listing', minPrice, coinId, user.userId)
            .then(() => {
                // update assets data
                fetchAsset('coinsByUser', user.userId);
                fetchAsset('listingsByUser', user.userId);
            });
    }

    cancelCoin = coinId => {
        const { user, createAssetOrTransaction, fetchAsset } = this.props;
        createAssetOrTransaction('cancelCoin', coinId)
            .then(() => {
                // update assets data
                fetchAsset('coinsByUser', user.userId);
                fetchAsset('listingsByUser', user.userId);
            });
    }

    endListing = listingId => {
        const { createAssetOrTransaction } = this.props;
        createAssetOrTransaction('endListing', listingId)
            .then(() => {
                this.loadData();
            });
    }

    isRouteActive = routeKey => _.last(window.location.href.split('/')) === routeKey;

    render() {
        const {
            coins,
            listings,
            bids,
            user,
            match,
            isDataReady,
        } = this.props;

        return (
            <Layout>
                {!isDataReady &&  <Loading />}
                <Header user={user} selected="dashboard" />
                {isDataReady &&
                    <Sider className="dashboard__sider">
                        <Statistic
                            className="dashboard__balance"
                            title="Account Balance (CAD)"
                            value={user.balance}
                            precision={2}
                            prefix="$"
                        />
                        <div className="dashboard__nav">
                            <Link to={`${match.path}/coins`}>
                                <div className={`dashboard__nav__item ${this.isRouteActive('coins') && 'dashboard__nav__item--active'}`}>
                                    <Statistic value={coins.length} valueStyle={{ fontSize: 48 }} />
                                    <h2 className="dashboard__nav__item__title">Coins</h2>
                                </div>
                            </Link>
                            <Link to={`${match.path}/listings`}>
                            <div className={`dashboard__nav__item ${this.isRouteActive('listings') && 'dashboard__nav__item--active'}`}>
                                    <Statistic value={listings.length} valueStyle={{ fontSize: 48 }} />
                                    <h2 className="dashboard__nav__item__title">Listings</h2>
                                </div>
                            </Link>
                            <Link to={`${match.path}/bids`}>
                            <div className={`dashboard__nav__item ${this.isRouteActive('bids') && 'dashboard__nav__item--active'}`}>
                                    <Statistic value={bids.length} valueStyle={{ fontSize: 48 }} />
                                    <h2 className="dashboard__nav__item__title">Bids</h2>
                                </div>
                            </Link>
                        </div>
                    </Sider>
                }
                {isDataReady &&
                    <Content>
                        <PrivateRoute 
                            exact
                            path={`${match.path}/coins`}
                            component={MyCoinsTable}
                            componentProps={{ coins, sellCoin: this.sellCoin, cancelCoin: this.cancelCoin }}
                        />
                        <PrivateRoute
                            exact
                            path={`${match.path}/listings`}
                            component={MyListingsTable}
                            componentProps={{ listings, endListing: this.endListing }}
                        />
                        <PrivateRoute
                            exact
                            path={`${match.path}/bids`}
                            component={MyBidsTable}
                            componentProps={{ bids }}
                        />
                    </Content>
                }
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    user: state.session.user,
    alert: state.alert,
    coins: coinsByUserSelector(state),
    listings: listingsWithCoinDataByUserSelector(state),
    bids: bidsByUserSelector(state),
    isDataReady: state.assets.coins.requestState.success
        && state.assets.listings.requestState.success
        && state.assets.bids.requestState.success
});

export default connect(mapStateToProps, {
    fetchAsset,
    createAssetOrTransaction,
    updateUserData: refetchUser,
    removeAllCoins,
})(DashboardPage);
