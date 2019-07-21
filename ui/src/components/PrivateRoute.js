import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, componentProps, ...rest}) => (
    <Route {...rest} render={props=> (
        localStorage.getItem('user')
            ? <Component {...props} {...componentProps} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location }}} />
    )} />
);

PrivateRoute.propTypes = {
    location: PropTypes.string,
};

export default PrivateRoute;
