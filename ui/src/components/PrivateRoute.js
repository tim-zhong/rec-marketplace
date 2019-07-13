import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, componentProps, ...rest}) => (
    <Route {...rest} render={props=> (
        localStorage.getItem('user')
            ? <Component {...props} {...componentProps} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location }}} />
    )} />
);

export default PrivateRoute;
