import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class DashboardPage extends React.Component {
    render() {
        const { user } = this.props;
        return (
            <div>
                <h1>{user.firstName}'s Dashboard</h1>
                <Link to="/login">Logout</Link>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.session.user,
    alert: state.alert,
});

export default connect(mapStateToProps)(DashboardPage);
