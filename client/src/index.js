import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import { stringify, parse } from 'qs';
import qhistory from 'qhistory';
import { Router } from 'react-router';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

const history = qhistory(
    createHistory(),
    stringify,
    parse
);

ReactDOM.render(
    <Router history={history}>
        <App />
    </Router>,
    document.getElementById('root')
);

registerServiceWorker();
