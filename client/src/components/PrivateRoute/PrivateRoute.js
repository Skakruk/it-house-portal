import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, currentUser, ...rest }) =>
    <Route
        {...rest}
        render={props =>
            currentUser.loggedIn
                ? <Component currentUser={currentUser} {...props} />
                : <Redirect
                    to={{
                        pathname: '/login',
                        state: { from: props.location }
                    }}
                />}
    />;

export default PrivateRoute;
