import React, { Component } from 'react';
import { Switch, Route } from 'react-router'

import LoginContainer from './containers/Login';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Switch>
                    <Route path="/login" component={LoginContainer}/>
                </Switch>
            </div>
        );
    }
}
export default App;
