import React from 'react';
import { connect } from 'react-redux';
import { fetchAsset } from '../actions/assetActions';
import Layout from './layout/Layout';
import ListingTable from './ListingTable';

const { Header, Content } = Layout;

class HomePage extends React.Component {
    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.props.fetchAsset('activeListings');
        this.props.fetchAsset('listedCoins');
    }

    render() {
        const { user } = this.props;
        return (
            <Layout>
                <Header user={user} selected="home" />
                <Content>
                    <h1>Coins Listed For Sale</h1>
                    <ListingTable/>
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
})(HomePage);
