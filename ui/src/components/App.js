import React from 'react';
import { Router, Route } from 'react-router-dom';
import{ connect } from 'react-redux';
import { history } from '../helpers/history';
import { alertClear } from '../actions/alertActions';
import PrivateRoute from '../components/PrivateRoute';
import HomePage from '../components/HomePage';
import LoginPage from '../components/LoginPage';

class App extends React.Component {
    constructor(props) {
        super(props);

        history.listen((location, action) => {
            // clear alert on location change
            this.props.alertClear();
        })
    }

    render() {
        const { alert } = this.props;

        return (
            <div className="App">
                {alert.message && 
                    <div>{`${alert.type}: ${alert.message}`}</div>
                }
                <Router history={history}>
                    <PrivateRoute exact path="/" component={HomePage} />
                    <Route path="/login" component={LoginPage} />
                </Router>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    alert: state.alert,
});

export default connect(mapStateToProps, { alertClear })(App);
