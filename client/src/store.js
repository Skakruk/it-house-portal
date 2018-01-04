import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const enhancer = compose(
    applyMiddleware(thunk)
);

export default createStore(rootReducer, {}, enhancer);
