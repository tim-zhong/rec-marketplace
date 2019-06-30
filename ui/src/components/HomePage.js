import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAsset } from '../actions/assetActions';
import Layout from './layout/Layout';

const { Header, Sider, Content } = Layout;

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
                <Sider>Sider</Sider>
                <Content>
                    <h1>Hi, {user.firstName}</h1>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/login">Logout</Link>
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
