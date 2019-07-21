import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { login, logout } from '../../actions/sessionActions';
import { Alert, Card } from 'antd';
import LoginForm from '../LoginForm';
import PropTypes from 'prop-types';
import '../../styles/pages/LoginPage.less';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.logout();
    }

    render() {
        const { alert, login, loggingIn } = this.props;
        return (
            <div className="login-page">
                <div className="login-page__bg"></div>
                <Card className="login-page__content" style={{ width: 400 }}>
                    <h1 className="login-page__greeting">Welcome!</h1>
                    <div className="login-page__alert-conatiner">
                        {!_.isEmpty(alert) && <Alert type="error" message={alert.message} />}
                    </div>
                    <LoginForm
                        login={login}
                        isLoggingIn={loggingIn}
                    />
                </Card>
            </div>
        );
    }
}

LoginPage.propTypes = {
    alert: PropTypes.object.isRequired,
    loggingIn: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    alert: state.alert,
    loggingIn: !!state.session.loggingIn,
});

export default connect(mapStateToProps, {
    login,
    logout,
})(LoginPage);
