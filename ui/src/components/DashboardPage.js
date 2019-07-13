import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchAsset } from '../actions/assetActions';
import PrivateRoute from '../components/PrivateRoute';
import { Statistic } from 'antd';
import Layout from './layout/Layout';
import MyCoins from './MyCoins';
import MyListings from './MyListings';
import MyBids from './MyBids';
import _ from 'lodash';
import '../styles/DashboardPage.less';

const { Header, Sider, Content, Loading } = Layout;

// TODO: create a factory for nav items
class DashboardPage extends React.Component {
    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        const { user, fetchAsset } = this.props;
        fetchAsset('coinsByUser', user.userId);
        fetchAsset('listingsByUser', user.userId);
        fetchAsset('bidsByUser', user.userId);
    }

    isRouteActive = routeKey => _.last(window.location.href.split('/')) === routeKey;

    render() {
        const { user, match, isDataReady } = this.props;
        return (
            <Layout>
                <Redirect to={{ pathname: `${match.path}/coins` }} />
                {isDataReady &&  <Loading />}
                <Header user={user} selected="dashboard" />
                {!isDataReady &&
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
                                    <Statistic value={100} valueStyle={{ fontSize: 48 }} />
                                    <h2 className="dashboard__nav__item__title">Coins</h2>
                                </div>
                            </Link>
                            <Link to={`${match.path}/listings`}>
                            <div className={`dashboard__nav__item ${this.isRouteActive('listings') && 'dashboard__nav__item--active'}`}>
                                    <Statistic value={10} valueStyle={{ fontSize: 48 }} />
                                    <h2 className="dashboard__nav__item__title">Listings</h2>
                                </div>
                            </Link>
                            <Link to={`${match.path}/bids`}>
                            <div className={`dashboard__nav__item ${this.isRouteActive('bids') && 'dashboard__nav__item--active'}`}>
                                    <Statistic value={4} valueStyle={{ fontSize: 48 }} />
                                    <h2 className="dashboard__nav__item__title">Bids</h2>
                                </div>
                            </Link>
                        </div>
                    </Sider>
                }
                {!isDataReady &&
                    <Content>
                        <PrivateRoute exact path={`${match.path}/coins`} component={MyCoins} />
                        <PrivateRoute exact path={`${match.path}/listings`} component={MyListings} />
                        <PrivateRoute exact path={`${match.path}/bids`} component={MyBids} />
                    </Content>
                }
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    user: state.session.user,
    alert: state.alert,
    isDataReady: state.assets.coins.requestState.success
    && state.assets.listings.requestState.busy
    && state.assets.bids.requestState.busy
});

export default connect(mapStateToProps, {
    fetchAsset,
})(DashboardPage);
