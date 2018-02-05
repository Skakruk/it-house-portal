import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { Spin } from 'antd';

import LoginContainer from './containers/Login';
import DashboardContainer from './containers/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import api from './helpers/api';

class App extends Component {
    state = {
        renderApp: false,
    };

    componentDidMount() {
        api.get('/user/self').then(() => {
            this.props.dispatch({ type: 'LOGIN_SUCCESS' });
        }, () => {
        }).catch(() => {

        }).then(() => {
            this.setState({
                renderApp: true,
            });
        })
    }

    render() {
        const { user } = this.props;

        if (!this.state.renderApp) return <Spin size="large" />; //show spinner

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
