import React from 'react';
import { Router, Route } from 'react-router-dom';
import{ connect } from 'react-redux';
import { history } from '../helpers/history';
import { alertClear } from '../actions/alertActions';
import PrivateRoute from '../components/PrivateRoute';
import HomePage from './pages/HomePage';
import DashboardPage from '../components/pages/DashboardPage';
import LoginPage from './pages/LoginPage';

class App extends React.Component {
    constructor(props) {
        super(props);

        history.listen((location, action) => {
            // clear alert on location change
            this.props.alertClear();
        })
    }

    render() {
        return (
            <div className="App">
                <Router history={history}>
                    <PrivateRoute exact path="/" component={HomePage} />
                    <PrivateRoute path="/dashboard" component={DashboardPage} />
                    <Route path="/login" component={LoginPage} />
                </Router>
            </div>
        );
    }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, { alertClear })(App);
