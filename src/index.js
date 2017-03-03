import React from 'react';
import {render} from 'react-dom';
//import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux';
import {Router,Route, browserHistory,IndexRoute} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux'
import styles from "./styles/stylesheet.scss";
import configureStore from './store/configureStore';
import App from './components/App';
import HomePage from './components/HomePage';

const store = configureStore();
// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={HomePage} />
            </Route>
        </Router>
  </Provider>, document.getElementById('app')
);