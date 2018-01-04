import React, { Component } from 'react';
import { Switch, Route, withRouter} from 'react-router-dom'
import { connect } from 'react-redux';

import LoginContainer from './containers/Login';
import DashboardContainer from './containers/Dashboard';
import PrivateRoute from './components/PrivateRoute';

class App extends Component {
    render() {
        const { user } = this.props;

        return (
            <div className="App">
                <Route path="/login" component={LoginContainer} />
                <PrivateRoute exact path="/" currentUser={user} component={DashboardContainer} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
});

export default withRouter(connect(mapStateToProps)(App));
