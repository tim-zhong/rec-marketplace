import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAsset } from '../actions/assetActions';

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
            <div>
                <h1>Hi, {user.firstName}</h1>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/login">Logout</Link>
            </div>
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
