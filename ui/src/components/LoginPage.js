import React from 'react';
import { connect } from 'react-redux';
import { login, logout } from '../actions/sessionActions';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.logout();
    }

    getInputValues = () => {
        return {
            username: this.username.value,
            password: this.password.value,
        };
    }

    handleSubmit = e => {
        e.preventDefault();

        const { username, password } = this.getInputValues();
        if ( username && password ) {
            this.props.login(username, password);
        }
    }

    render() {
        return (
            <div>
                <h1>Login</h1>
                <form onSubmit={this.handleSubmit}>
                    <input ref={input => this.username=input}></input>
                    <input ref={input => this.password=input}></input>
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    logginIn: state.session.logginIn
});

export default connect(mapStateToProps, {
    login,
    logout,
})(LoginPage);
