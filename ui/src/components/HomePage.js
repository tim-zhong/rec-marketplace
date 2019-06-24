import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class HomePage extends React.Component {
    render() {
        const { user } = this.props;
        return (
            <div>
                <h1>Hi, {user.firstName}</h1>
                <Link to="/login">Logout</Link>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.session.user,
    alert: state.alert,
});

export default connect(mapStateToProps)(HomePage);
