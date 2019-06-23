import React from 'react';
import { connect } from 'react-redux';
import { authRequest, authSuccess, authFailure } from '../actions/sessionActions';

class LoginPage extends React.Component {
    render() {
        return (
            <div>
                <h1>Login</h1>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    session: state.session
});

export default connect(mapStateToProps, {
    authRequest,
    authSuccess,
    authFailure,
})(LoginPage);
