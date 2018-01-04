import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import { stringify, parse } from 'qs';
import qhistory from 'qhistory';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import store from './store';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

const history = qhistory(
    createHistory(),
    stringify,
    parse
);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
